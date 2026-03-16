import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import vm from 'vm';

import { safeJsonParse } from '../json-utils';
import { toNumberOrNull } from '../number-utils';
import { WorkflowFileEnvelope, WorkflowMulterFileLike } from './types';

export type OpenAIResponsesClient = Pick<OpenAI, 'responses'>;

export type WorkflowProviderResponse = {
  provider: string;
  model: string;
  text: string;
  raw: unknown;
};

export type WorkflowRouteModelCandidate<TModel extends string = string> = {
  model: TModel;
  nodeId?: string;
};

export type WorkflowRouteModelResult<TModel extends string = string> = {
  selectedModel: TModel;
  routingReasoning: string;
  rawText: string;
  raw: unknown;
};

let cachedOpenAIClient: OpenAIResponsesClient | null = null;

const resolveOpenAIClient = (options?: {
  apiKey?: string;
  client?: OpenAIResponsesClient;
}): OpenAIResponsesClient => {
  if (options?.client) return options.client;

  const explicitApiKey = parseStringValue(options?.apiKey).trim();
  if (explicitApiKey) {
    return new OpenAI({ apiKey: explicitApiKey });
  }

  if (cachedOpenAIClient) return cachedOpenAIClient;

  const envApiKey = parseStringValue(process.env.OPENAI_API_KEY).trim();
  if (!envApiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  cachedOpenAIClient = new OpenAI({ apiKey: envApiKey });
  return cachedOpenAIClient;
};

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

export const callOpenAIModel = async (
  modelName: string,
  prompt: string,
  options?: {
    apiKey?: string;
    client?: OpenAIResponsesClient;
    temperature?: number;
    instructions?: string;
  },
): Promise<unknown> => {
  const client = resolveOpenAIClient({
    apiKey: options?.apiKey,
    client: options?.client,
  });
  const resolvedModel = modelName || 'gpt-4.1-mini';
  const temperature = toNumberOrNull(options?.temperature);
  const instructions = parseStringValue(options?.instructions).trim();

  const response = await client.responses.create({
    model: resolvedModel,
    input: prompt,
    temperature: temperature === null ? undefined : temperature,
    instructions: instructions || undefined,
  } as any);

  return {
    text: parseStringValue((response as { output_text?: unknown }).output_text).trim(),
    model: resolvedModel,
    raw: response,
  };
};

const extractAssistantTextFromChatCompletionsResponse = (response: unknown): string => {
  if (!response || typeof response !== 'object' || Array.isArray(response)) {
    return '';
  }

  const choices = (response as { choices?: unknown[] }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return '';
  }

  const firstChoice = choices[0];
  if (!firstChoice || typeof firstChoice !== 'object' || Array.isArray(firstChoice)) {
    return '';
  }

  const message = (firstChoice as { message?: unknown }).message;
  if (!message || typeof message !== 'object' || Array.isArray(message)) {
    return '';
  }

  const content = (message as { content?: unknown }).content;
  if (typeof content === 'string') {
    return content.trim();
  }

  return '';
};

export const callOpenAiCompatibleModel = async (params: {
  provider: string;
  endpoint: string;
  apiKey: string;
  model: string;
  prompt: string;
  temperature?: number;
  signal?: AbortSignal;
}): Promise<WorkflowProviderResponse> => {
  const response = await fetch(params.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model,
      messages: [{ role: 'user', content: params.prompt }],
      temperature: params.temperature ?? 0.2,
    }),
    signal: params.signal,
  });

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = parseStringValue(
      (responseBody as { error?: { message?: unknown } })?.error?.message,
    ).trim() || `${params.provider} request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const text = extractAssistantTextFromChatCompletionsResponse(responseBody);

  return {
    provider: params.provider,
    model: params.model,
    text,
    raw: responseBody,
  };
};

export const callDeepSeekModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string; temperature?: number; signal?: AbortSignal },
): Promise<WorkflowProviderResponse> => {
  const apiKey = parseStringValue(options?.apiKey || process.env.DEEPSEEK_API_KEY).trim();
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured.');
  }

  return callOpenAiCompatibleModel({
    provider: 'deepseek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    apiKey,
    model: modelName || 'deepseek-chat',
    prompt,
    temperature: options?.temperature ?? 0.2,
    signal: options?.signal,
  });
};

export const callPerplexityModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string; temperature?: number; signal?: AbortSignal },
): Promise<WorkflowProviderResponse> => {
  const apiKey = parseStringValue(options?.apiKey || process.env.PERPLEXITY_API_KEY).trim();
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is not configured.');
  }

  return callOpenAiCompatibleModel({
    provider: 'perplexity',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    apiKey,
    model: modelName || 'sonar',
    prompt,
    temperature: options?.temperature ?? 0.2,
    signal: options?.signal,
  });
};

export const callMistralModel = async (
  modelName: string,
  prompt: string,
  options?: { apiKey?: string; temperature?: number; signal?: AbortSignal },
): Promise<WorkflowProviderResponse> => {
  const apiKey = parseStringValue(options?.apiKey || process.env.MISTRAL_API_KEY).trim();
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not configured.');
  }

  return callOpenAiCompatibleModel({
    provider: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    apiKey,
    model: modelName || 'mistral-large-latest',
    prompt,
    temperature: options?.temperature ?? 0.2,
    signal: options?.signal,
  });
};

const serializeForPrompt = (value: unknown): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return parseStringValue(value);
  }
};

export const routeModelCandidateWithOpenAI = async <TModel extends string>(params: {
  candidates: Array<WorkflowRouteModelCandidate<TModel>>;
  routingPrompt: string;
  workflowInput: unknown;
  routerModel?: string;
  apiKey?: string;
  client?: OpenAIResponsesClient;
}): Promise<WorkflowRouteModelResult<TModel>> => {
  if (!params.candidates.length) {
    throw new Error('At least one candidate is required for model routing.');
  }

  if (params.candidates.length === 1) {
    return {
      selectedModel: params.candidates[0].model,
      routingReasoning: 'Single candidate available.',
      rawText: '',
      raw: null,
    };
  }

  const prompt = [
    'You are routing a workflow governor to one model candidate.',
    'Return strict JSON only using this shape:',
    '{"selectedModel":"model-id","reasoning":"short reason"}',
    '',
    `Routing instruction: ${params.routingPrompt}`,
    '',
    `Candidates: ${serializeForPrompt(params.candidates)}`,
    '',
    `Workflow input: ${serializeForPrompt(params.workflowInput)}`,
  ].join('\n');

  const response = await callOpenAIModel(
    params.routerModel || 'gpt-4.1-mini',
    prompt,
    {
      apiKey: params.apiKey,
      client: params.client,
      temperature: 0.1,
      instructions: 'Return JSON only. selectedModel must be one of provided candidates.',
    },
  );

  const responseRaw = (response as { raw?: unknown }).raw;
  const rawText = parseStringValue(
    (responseRaw as { output_text?: unknown })?.output_text,
  ).trim();
  if (!rawText) {
    return {
      selectedModel: params.candidates[0].model,
      routingReasoning: 'Router returned empty payload, fallback to first candidate.',
      rawText,
      raw: responseRaw,
    };
  }

  try {
    const parsed = JSON.parse(rawText) as {
      selectedModel?: unknown;
      reasoning?: unknown;
    };
    const selectedModelRaw = parseStringValue(parsed.selectedModel).trim();
    const selectedCandidate = params.candidates.find(
      (candidate) => candidate.model === selectedModelRaw,
    );

    if (!selectedCandidate) {
      return {
        selectedModel: params.candidates[0].model,
        routingReasoning: 'Router selected unsupported model, fallback to first candidate.',
        rawText,
        raw: responseRaw,
      };
    }

    return {
      selectedModel: selectedCandidate.model,
      routingReasoning:
        parseStringValue(parsed.reasoning).trim() || 'Router selected candidate.',
      rawText,
      raw: responseRaw,
    };
  } catch {
    return {
      selectedModel: params.candidates[0].model,
      routingReasoning: 'Router payload parsing failed, fallback to first candidate.',
      rawText,
      raw: responseRaw,
    };
  }
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
