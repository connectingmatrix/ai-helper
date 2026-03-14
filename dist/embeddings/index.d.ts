import OpenAI from 'openai';
export type EmbeddingVector = {
    vector: number[];
    pgVector: string;
};
export type EmbeddingClient = Pick<OpenAI, 'embeddings'>;
export type EmbeddingOptions = {
    model?: string;
    apiKey?: string;
    client?: EmbeddingClient;
};
export declare const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export declare function createEmbedding(input: string, options?: EmbeddingOptions): Promise<EmbeddingVector>;
export declare function createEmbeddings(inputs: string[], options?: EmbeddingOptions): Promise<EmbeddingVector[]>;
//# sourceMappingURL=index.d.ts.map