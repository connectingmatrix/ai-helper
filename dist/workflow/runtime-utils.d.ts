import { WorkflowFileEnvelope, WorkflowMulterFileLike } from './types';
export declare const isObjectRecord: (value: unknown) => value is Record<string, unknown>;
export declare const parseRecordValue: (value: unknown) => Record<string, unknown>;
export declare const parseStringValue: (value: unknown) => string;
export declare const parseNumberValue: (value: unknown, fallback: number) => number;
export declare const parseStringList: (value: unknown) => string[];
export declare const parseHeaderRecord: (value: unknown) => Record<string, string>;
export declare const fileEnvelopeToBuffer: (file: WorkflowFileEnvelope) => Buffer;
export declare const fileEnvelopeToMulterFile: (file: WorkflowFileEnvelope) => WorkflowMulterFileLike;
export declare const evaluateJavascript: (code: string, context: {
    input: Record<string, unknown>;
    properties: Record<string, unknown>;
}, signal?: AbortSignal) => Promise<{
    result: unknown;
    logs: string[];
    error: string | null;
}>;
export declare const formatOutputValue: (value: unknown, format: string) => {
    output: unknown;
    format: string;
};
export declare const callGeminiModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
}) => Promise<unknown>;
export declare const callClaudeModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    signal?: AbortSignal;
}) => Promise<unknown>;
export declare const callGroqModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    signal?: AbortSignal;
}) => Promise<unknown>;
export declare const parseCsvText: (csv: string) => {
    columns: string[];
    rows: Array<Record<string, string>>;
};
//# sourceMappingURL=runtime-utils.d.ts.map