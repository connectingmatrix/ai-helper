"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvText = exports.callGroqModel = exports.callClaudeModel = exports.callGeminiModel = exports.formatOutputValue = exports.evaluateJavascript = exports.fileEnvelopeToMulterFile = exports.fileEnvelopeToBuffer = exports.parseHeaderRecord = exports.parseStringList = exports.parseNumberValue = exports.parseStringValue = exports.parseRecordValue = exports.isObjectRecord = void 0;
const generative_ai_1 = require("@google/generative-ai");
const vm_1 = __importDefault(require("vm"));
const json_utils_1 = require("../json-utils");
const number_utils_1 = require("../number-utils");
const isObjectRecord = (value) => (typeof value === 'object' && value !== null && !Array.isArray(value));
exports.isObjectRecord = isObjectRecord;
const parseRecordValue = (value) => ((0, exports.isObjectRecord)(value) ? value : {});
exports.parseRecordValue = parseRecordValue;
const parseStringValue = (value) => (typeof value === 'string' ? value : String(value ?? ''));
exports.parseStringValue = parseStringValue;
const parseNumberValue = (value, fallback) => {
    const parsed = (0, number_utils_1.toNumberOrNull)(value);
    return parsed === null ? fallback : parsed;
};
exports.parseNumberValue = parseNumberValue;
const parseStringList = (value) => {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0);
};
exports.parseStringList = parseStringList;
const parseHeaderRecord = (value) => {
    if ((0, exports.isObjectRecord)(value)) {
        return Object.entries(value).reduce((acc, [key, item]) => {
            acc[key] = (0, exports.parseStringValue)(item);
            return acc;
        }, {});
    }
    if (typeof value !== 'string')
        return {};
    const parsed = (0, json_utils_1.safeJsonParse)(value);
    if (!parsed)
        return {};
    return (0, exports.parseHeaderRecord)(parsed);
};
exports.parseHeaderRecord = parseHeaderRecord;
const fileEnvelopeToBuffer = (file) => {
    const contentBase64 = (0, exports.parseStringValue)(file.contentBase64);
    return Buffer.from(contentBase64, 'base64');
};
exports.fileEnvelopeToBuffer = fileEnvelopeToBuffer;
const fileEnvelopeToMulterFile = (file) => {
    const buffer = (0, exports.fileEnvelopeToBuffer)(file);
    return {
        fieldname: 'files',
        originalname: (0, exports.parseStringValue)(file.name) || 'attachment.bin',
        encoding: '7bit',
        mimetype: (0, exports.parseStringValue)(file.mimeType) || 'application/octet-stream',
        size: buffer.byteLength,
        buffer,
    };
};
exports.fileEnvelopeToMulterFile = fileEnvelopeToMulterFile;
const evaluateJavascript = async (code, context, signal) => {
    const logs = [];
    const sandbox = {
        input: context.input,
        properties: context.properties,
        console: {
            log: (...args) => {
                logs.push(args.map((arg) => (0, exports.parseStringValue)(arg)).join(' '));
            },
            warn: (...args) => {
                logs.push(args.map((arg) => (0, exports.parseStringValue)(arg)).join(' '));
            },
            error: (...args) => {
                logs.push(args.map((arg) => (0, exports.parseStringValue)(arg)).join(' '));
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
        const script = new vm_1.default.Script(wrapped);
        const vmContext = vm_1.default.createContext(sandbox);
        const result = await script.runInContext(vmContext, { timeout: 15000 });
        return {
            result,
            logs,
            error: null,
        };
    }
    catch (error) {
        return {
            result: null,
            logs,
            error: error instanceof Error ? error.message : 'Execution failed.',
        };
    }
};
exports.evaluateJavascript = evaluateJavascript;
const formatOutputValue = (value, format) => {
    if (format === 'table') {
        if (Array.isArray(value)) {
            const first = value[0];
            const columns = (0, exports.isObjectRecord)(first) ? Object.keys(first) : [];
            return {
                format,
                output: {
                    rows: value,
                    columns,
                },
            };
        }
        if ((0, exports.isObjectRecord)(value)) {
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
exports.formatOutputValue = formatOutputValue;
const callGeminiModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }
    const resolvedModel = modelName || 'gemini-1.5-flash';
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: resolvedModel });
    const response = await model.generateContent(prompt);
    return {
        text: response.response.text(),
        model: resolvedModel,
    };
};
exports.callGeminiModel = callGeminiModel;
const callClaudeModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.ANTHROPIC_API_KEY);
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
        throw new Error((0, exports.parseStringValue)(payload.error?.message) ||
            'Claude request failed.');
    }
    const content = Array.isArray(payload.content)
        ? payload.content
        : [];
    return {
        text: content
            .map((item) => (0, exports.parseStringValue)(item.text))
            .filter((item) => item.length > 0)
            .join('\n'),
        model: resolvedModel,
        raw: payload,
    };
};
exports.callClaudeModel = callClaudeModel;
const callGroqModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.GROQ_API_KEY);
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
        throw new Error((0, exports.parseStringValue)(payload.error?.message) ||
            'Groq request failed.');
    }
    const text = (0, exports.parseStringValue)(payload.choices?.[0]?.message?.content);
    return {
        text,
        model: resolvedModel,
        raw: payload,
    };
};
exports.callGroqModel = callGroqModel;
const splitCsvLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === '"') {
            if (inQuotes && line[index + 1] === '"') {
                current += '"';
                index += 1;
            }
            else {
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
const parseCsvText = (csv) => {
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
        if (value.length > 0)
            return value;
        return `col_${index + 1}`;
    });
    const rows = lines.slice(1).map((line) => {
        const cells = splitCsvLine(line);
        return columns.reduce((acc, column, index) => {
            acc[column] = (0, exports.parseStringValue)(cells[index] ?? '');
            return acc;
        }, {});
    });
    return {
        columns,
        rows,
    };
};
exports.parseCsvText = parseCsvText;
