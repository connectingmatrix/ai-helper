export type SerpResultItem = {
    title: string;
    link: string;
    snippet: string;
    source: string | null;
    position: number | null;
    date: string | null;
};
export type SerpSearchResponse = {
    query: string;
    engine: string;
    items: SerpResultItem[];
};
export type SerpSearchInput = {
    query: string;
    num?: number;
    location?: string;
    hl?: string;
    engine?: string;
    apiKey?: string;
};
export declare function searchSerpWeb(input: SerpSearchInput): Promise<SerpSearchResponse>;
//# sourceMappingURL=index.d.ts.map