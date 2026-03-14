import { getJson } from 'serpapi';

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

function toStringValue(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeHost(urlValue: string) {
  try {
    return new URL(urlValue).hostname;
  } catch (_error) {
    return null;
  }
}

export async function searchSerpWeb(input: SerpSearchInput): Promise<SerpSearchResponse> {
  const query = toStringValue(input.query);
  if (!query) {
    return {
      query: '',
      engine: input.engine || 'google',
      items: [],
    };
  }

  const apiKey = toStringValue(input.apiKey || process.env.SERPAPI_API_KEY);
  if (!apiKey) {
    return {
      query,
      engine: input.engine || 'google',
      items: [],
    };
  }

  const maxResults = Math.min(20, Math.max(1, Number(input.num || 6)));
  const engine = toStringValue(input.engine) || 'google';

  const rawResponse: any = await getJson(engine as any, {
    api_key: apiKey,
    q: query,
    num: maxResults,
    location: input.location || 'United States',
    hl: input.hl || 'en',
  });

  const items = (rawResponse?.organic_results || [])
    .map((entry: any) => {
      const title = toStringValue(entry?.title);
      const link = toStringValue(entry?.link);
      const snippet = toStringValue(entry?.snippet || entry?.rich_snippet);
      if (!title || !link) return null;

      return {
        title,
        link,
        snippet,
        source: normalizeHost(link),
        position: Number.isFinite(Number(entry?.position)) ? Number(entry.position) : null,
        date: toStringValue(entry?.date) || null,
      } as SerpResultItem;
    })
    .filter(Boolean)
    .slice(0, maxResults) as SerpResultItem[];

  return {
    query,
    engine,
    items,
  };
}
