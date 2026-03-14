"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSerpWeb = searchSerpWeb;
const serpapi_1 = require("serpapi");
function toStringValue(value) {
    if (value === null || value === undefined)
        return '';
    return String(value).trim();
}
function normalizeHost(urlValue) {
    try {
        return new URL(urlValue).hostname;
    }
    catch (_error) {
        return null;
    }
}
async function searchSerpWeb(input) {
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
    const rawResponse = await (0, serpapi_1.getJson)(engine, {
        api_key: apiKey,
        q: query,
        num: maxResults,
        location: input.location || 'United States',
        hl: input.hl || 'en',
    });
    const items = (rawResponse?.organic_results || [])
        .map((entry) => {
        const title = toStringValue(entry?.title);
        const link = toStringValue(entry?.link);
        const snippet = toStringValue(entry?.snippet || entry?.rich_snippet);
        if (!title || !link)
            return null;
        return {
            title,
            link,
            snippet,
            source: normalizeHost(link),
            position: Number.isFinite(Number(entry?.position)) ? Number(entry.position) : null,
            date: toStringValue(entry?.date) || null,
        };
    })
        .filter(Boolean)
        .slice(0, maxResults);
    return {
        query,
        engine,
        items,
    };
}
