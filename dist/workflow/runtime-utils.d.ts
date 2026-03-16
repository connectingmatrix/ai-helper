import OpenAI from 'openai';
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
export declare const callOpenAIModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    client?: OpenAIResponsesClient;
    temperature?: number;
    instructions?: string;
}) => Promise<unknown>;
export declare const callOpenAiCompatibleModel: (params: {
    provider: string;
    endpoint: string;
    apiKey: string;
    model: string;
    prompt: string;
    temperature?: number;
    signal?: AbortSignal;
}) => Promise<WorkflowProviderResponse>;
export declare const callDeepSeekModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    temperature?: number;
    signal?: AbortSignal;
}) => Promise<WorkflowProviderResponse>;
export declare const callPerplexityModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    temperature?: number;
    signal?: AbortSignal;
}) => Promise<WorkflowProviderResponse>;
export declare const callMistralModel: (modelName: string, prompt: string, options?: {
    apiKey?: string;
    temperature?: number;
    signal?: AbortSignal;
}) => Promise<WorkflowProviderResponse>;
export declare const routeModelCandidateWithOpenAI: <TModel extends string>(params: {
    candidates: Array<WorkflowRouteModelCandidate<TModel>>;
    routingPrompt: string;
    workflowInput: unknown;
    routerModel?: string;
    apiKey?: string;
    client?: OpenAIResponsesClient;
}) => Promise<WorkflowRouteModelResult<TModel>>;
export declare const parseCsvText: (csv: string) => {
    columns: string[];
    rows: Array<Record<string, string>>;
};
//# sourceMappingURL=runtime-utils.d.ts.map