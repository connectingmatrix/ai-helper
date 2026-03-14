export type ChunkingOptions = {
    maxChunkChars?: number;
    overlapChars?: number;
    minChunkChars?: number;
};
export type ChunkUnit = {
    chunkIndex: number;
    content: string;
    tokenCount: number;
};
export declare function chunkText(text: string, options?: ChunkingOptions): ChunkUnit[];
//# sourceMappingURL=index.d.ts.map