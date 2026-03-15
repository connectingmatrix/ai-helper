import { GoogleGenerativeAI } from '@google/generative-ai';
import vm from 'vm';

import { safeJsonParse } from '../json-utils';
import { toNumberOrNull } from '../number-utils';
import { WorkflowFileEnvelope, WorkflowMulterFileLike } from './types';

export const isObjectRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

export const parseRecordValue = (value: unknown): Record<string, unknown> => (
  isObjectRecord(value) ? value : {}
);

export const parseStringValue = (value: unknown): string => (
  typeof value === 'string' ? value : String(value ?? '')
);

export const parseNumberValue = (value: unknown, fallback: number): number => {
  const parsed = toNumberOrNull(value);
  return parsed === null ? fallback : parsed;
};

export const parseStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
};

export const parseHeaderRecord = (value: unknown): Record<string, string> => {
  if (isObjectRecord(value)) {
    return Object.entries(value).reduce<Record<string, string>>((acc, [key, item]) => {
      acc[key] = parseStringValue(item);
      return acc;
    }, {});
  }

  if (typeof value !== 'string') return {};

  const parsed = safeJsonParse<unknown>(value);
  if (!parsed) return {};
  return parseHeaderRecord(parsed);
};

export const fileEnvelopeToBuffer = (file: WorkflowFileEnvelope): Buffer => {
  const contentBase64 = parseStringValue(file.contentBase64);
  return Buffer.from(contentBase64, 'base64');
};

export const fileEnvelopeToMulterFile = (
  file: WorkflowFileEnvelope,
): WorkflowMulterFileLike => {
  const buffer = fileEnvelopeToBuffer(file);

  return {
    fieldname: 'files',
    originalname: parseStringValue(file.name) || 'attachment.bin',
    encoding: '7bit',
    mimetype: parseStringValue(file.mimeType) || 'application/octet-stream',
    size: buffer.byteLength,
    buffer,
  };
};

export const evaluateJavascript = async (
  code: string,
  context: {
    input: Record<string, unknown>;
    properties: Record<string, unknown>;
  },
  signal?: AbortSignal,
): Promise<{ result: unknown; logs: string[]; error: string | null }> => {
  const logs: string[] = [];

  const sandbox = {
    input: context.input,
    properties: context.properties,
    console: {
      log: (...args: unknown[]) => {
        logs.push(args.map((arg) => parseStringValue(arg)).join(' '));
      },
      warn: (...args: unknown[]) => {
        logs.push(args.map((arg) => parseStringValue(arg)).join(' '));
      },
      error: (...args: unknown[]) => {
        logs.push(args.map((arg) => parseStringValue(arg)).join(' '));
      },
    },
    Date,
    Math,
    JSON,
    Buffer,
    setTimeout,
    clearTimeout,
  };

  try {
    if (signal?.aborted) {
      return {
        result: null,
        logs,
        error: 'Execution aborted.',
      };
    }

    const wrapped = `(async () => {${code}\n})()`;
    const script = new vm.Script(wrapped);
    const vmContext = vm.createContext(sandbox);
    const result = await script.runInContext(vmContext, { timeout: 15000 });

    return {
      result,
      logs,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      logs,
      error: error instanceof Error ? error.message : 'Execution failed.',
    };
  }
};

export const formatOutputValue = (
  value: unknown,
  format: string,
): { output: unknown; format: string } => {
  if (format === 'table') {
    if (Array.isArray(value)) {
      const first = value[0];
      const columns = isObjectRecord(first) ? Object.keys(first) : [];

      return {
        format,
        output: {
          rows: value,
          columns,
        },
      };
    }

    if (isObjectRecord(value)) {
      const rows = Object.entries(value).map(([key, item]) => ({
        key,
        value: item,
      }));

      return {
        format,
        output: {
          rows,
          columns: ['key', 'value'],
        },
      };
    }

    return {
      format,
      output: {
        rows: [],
        columns: [],
      },
    };
  }

  if (format === 'markdown') {
    if (typeof value === 'string') {
      return {
        format,
        output: value,
      };
    }

    return {
      format,
      output: `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``,
    };
  }

  if (format === 'raw') {
    return {
      format,
      output: typeof value === 'string' ? value : JSON.stringify(value),
    };
  }

  return {
    format: 'json',
    output: value,
  };
};

export const callGeminiModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string },
): Promise<unknown> => {
  const apiKey = parseStringValue(
    options?.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  );

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const resolvedModel = modelName || 'gemini-1.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: resolvedModel });
  const response = await model.generateContent(prompt);

  return {
    text: response.response.text(),
    model: resolvedModel,
  };
};

export const callClaudeModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string; signal?: AbortSignal },
): Promise<unknown> => {
  const apiKey = parseStringValue(options?.apiKey || process.env.ANTHROPIC_API_KEY);
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const resolvedModel = modelName || 'claude-3-5-sonnet-20241022';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: resolvedModel,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: options?.signal,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      parseStringValue((payload as { error?: { message?: string } }).error?.message) ||
      'Claude request failed.',
    );
  }

  const content = Array.isArray((payload as { content?: unknown[] }).content)
    ? (payload as { content: Array<{ text?: string }> }).content
    : [];

  return {
    text: content
      .map((item) => parseStringValue(item.text))
      .filter((item) => item.length > 0)
      .join('\n'),
    model: resolvedModel,
    raw: payload,
  };
};

export const callGroqModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string; signal?: AbortSignal },
): Promise<unknown> => {
  const apiKey = parseStringValue(options?.apiKey || process.env.GROQ_API_KEY);
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  const resolvedModel = modelName || 'llama-3.3-70b-versatile';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolvedModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
    signal: options?.signal,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      parseStringValue((payload as { error?: { message?: string } }).error?.message) ||
      'Groq request failed.',
    );
  }

  const text = parseStringValue(
    (payload as {
      choices?: Array<{ message?: { content?: string } }>;
    }).choices?.[0]?.message?.content,
  );

  return {
    text,
    model: resolvedModel,
    raw: payload,
  };
};

const splitCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

export const parseCsvText = (csv: string): {
  columns: string[];
  rows: Array<Record<string, string>>;
} => {
  const lines = csv
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return {
      columns: [],
      rows: [],
    };
  }

  const columns = splitCsvLine(lines[0]).map((item, index) => {
    const value = item.trim();
    if (value.length > 0) return value;
    return `col_${index + 1}`;
  });

  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);

    return columns.reduce<Record<string, string>>((acc, column, index) => {
      acc[column] = parseStringValue(cells[index] ?? '');
      return acc;
    }, {});
  });

  return {
    columns,
    rows,
  };
};
