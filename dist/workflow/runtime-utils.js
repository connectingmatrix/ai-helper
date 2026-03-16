"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvText = exports.routeModelCandidateWithOpenAI = exports.callMistralModel = exports.callPerplexityModel = exports.callDeepSeekModel = exports.callOpenAiCompatibleModel = exports.callOpenAIModel = exports.callGroqModel = exports.callClaudeModel = exports.callGeminiModel = exports.formatOutputValue = exports.evaluateJavascript = exports.fileEnvelopeToMulterFile = exports.fileEnvelopeToBuffer = exports.parseHeaderRecord = exports.parseStringList = exports.parseNumberValue = exports.parseStringValue = exports.parseRecordValue = exports.isObjectRecord = void 0;
const generative_ai_1 = require("@google/generative-ai");
const openai_1 = __importDefault(require("openai"));
const vm_1 = __importDefault(require("vm"));
const json_utils_1 = require("../json-utils");
const number_utils_1 = require("../number-utils");
let cachedOpenAIClient = null;
const resolveOpenAIClient = (options) => {
    if (options?.client)
        return options.client;
    const explicitApiKey = (0, exports.parseStringValue)(options?.apiKey).trim();
    if (explicitApiKey) {
        return new openai_1.default({ apiKey: explicitApiKey });
    }
    if (cachedOpenAIClient)
        return cachedOpenAIClient;
    const envApiKey = (0, exports.parseStringValue)(process.env.OPENAI_API_KEY).trim();
    if (!envApiKey) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
    cachedOpenAIClient = new openai_1.default({ apiKey: envApiKey });
    return cachedOpenAIClient;
};
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
const callOpenAIModel = async (modelName, prompt, options) => {
    const client = resolveOpenAIClient({
        apiKey: options?.apiKey,
        client: options?.client,
    });
    const resolvedModel = modelName || 'gpt-4.1-mini';
    const temperature = (0, number_utils_1.toNumberOrNull)(options?.temperature);
    const instructions = (0, exports.parseStringValue)(options?.instructions).trim();
    const response = await client.responses.create({
        model: resolvedModel,
        input: prompt,
        temperature: temperature === null ? undefined : temperature,
        instructions: instructions || undefined,
    });
    return {
        text: (0, exports.parseStringValue)(response.output_text).trim(),
        model: resolvedModel,
        raw: response,
    };
};
exports.callOpenAIModel = callOpenAIModel;
const extractAssistantTextFromChatCompletionsResponse = (response) => {
    if (!response || typeof response !== 'object' || Array.isArray(response)) {
        return '';
    }
    const choices = response.choices;
    if (!Array.isArray(choices) || choices.length === 0) {
        return '';
    }
    const firstChoice = choices[0];
    if (!firstChoice || typeof firstChoice !== 'object' || Array.isArray(firstChoice)) {
        return '';
    }
    const message = firstChoice.message;
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
        return '';
    }
    const content = message.content;
    if (typeof content === 'string') {
        return content.trim();
    }
    return '';
};
const callOpenAiCompatibleModel = async (params) => {
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
        const message = (0, exports.parseStringValue)(responseBody?.error?.message).trim() || `${params.provider} request failed with status ${response.status}.`;
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
exports.callOpenAiCompatibleModel = callOpenAiCompatibleModel;
const callDeepSeekModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.DEEPSEEK_API_KEY).trim();
    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured.');
    }
    return (0, exports.callOpenAiCompatibleModel)({
        provider: 'deepseek',
        endpoint: 'https://api.deepseek.com/chat/completions',
        apiKey,
        model: modelName || 'deepseek-chat',
        prompt,
        temperature: options?.temperature ?? 0.2,
        signal: options?.signal,
    });
};
exports.callDeepSeekModel = callDeepSeekModel;
const callPerplexityModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.PERPLEXITY_API_KEY).trim();
    if (!apiKey) {
        throw new Error('PERPLEXITY_API_KEY is not configured.');
    }
    return (0, exports.callOpenAiCompatibleModel)({
        provider: 'perplexity',
        endpoint: 'https://api.perplexity.ai/chat/completions',
        apiKey,
        model: modelName || 'sonar',
        prompt,
        temperature: options?.temperature ?? 0.2,
        signal: options?.signal,
    });
};
exports.callPerplexityModel = callPerplexityModel;
const callMistralModel = async (modelName, prompt, options) => {
    const apiKey = (0, exports.parseStringValue)(options?.apiKey || process.env.MISTRAL_API_KEY).trim();
    if (!apiKey) {
        throw new Error('MISTRAL_API_KEY is not configured.');
    }
    return (0, exports.callOpenAiCompatibleModel)({
        provider: 'mistral',
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        apiKey,
        model: modelName || 'mistral-large-latest',
        prompt,
        temperature: options?.temperature ?? 0.2,
        signal: options?.signal,
    });
};
exports.callMistralModel = callMistralModel;
const serializeForPrompt = (value) => {
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return (0, exports.parseStringValue)(value);
    }
};
const routeModelCandidateWithOpenAI = async (params) => {
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
    const response = await (0, exports.callOpenAIModel)(params.routerModel || 'gpt-4.1-mini', prompt, {
        apiKey: params.apiKey,
        client: params.client,
        temperature: 0.1,
        instructions: 'Return JSON only. selectedModel must be one of provided candidates.',
    });
    const responseRaw = response.raw;
    const rawText = (0, exports.parseStringValue)(responseRaw?.output_text).trim();
    if (!rawText) {
        return {
            selectedModel: params.candidates[0].model,
            routingReasoning: 'Router returned empty payload, fallback to first candidate.',
            rawText,
            raw: responseRaw,
        };
    }
    try {
        const parsed = JSON.parse(rawText);
        const selectedModelRaw = (0, exports.parseStringValue)(parsed.selectedModel).trim();
        const selectedCandidate = params.candidates.find((candidate) => candidate.model === selectedModelRaw);
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
            routingReasoning: (0, exports.parseStringValue)(parsed.reasoning).trim() || 'Router selected candidate.',
            rawText,
            raw: responseRaw,
        };
    }
    catch {
        return {
            selectedModel: params.candidates[0].model,
            routingReasoning: 'Router payload parsing failed, fallback to first candidate.',
            rawText,
            raw: responseRaw,
        };
    }
};
exports.routeModelCandidateWithOpenAI = routeModelCandidateWithOpenAI;
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
