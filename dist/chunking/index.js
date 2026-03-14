"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkText = chunkText;
const DEFAULT_MAX_CHUNK_CHARS = 1200;
const DEFAULT_OVERLAP_CHARS = 180;
const DEFAULT_MIN_CHUNK_CHARS = 120;
function estimateTokens(text) {
    const normalized = text.trim();
    if (!normalized)
        return 0;
    return Math.max(1, Math.ceil(normalized.length / 4));
}
function normalizeText(text) {
    return text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/\u00a0/g, ' ').trim();
}
function splitByParagraphs(text) {
    return text
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
}
function splitLongText(text, maxChunkChars) {
    const words = text.split(/\s+/).filter(Boolean);
    if (!words.length)
        return [];
    const chunks = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length <= maxChunkChars) {
            current = candidate;
            continue;
        }
        if (current)
            chunks.push(current);
        current = word;
    }
    if (current)
        chunks.push(current);
    return chunks;
}
function splitParagraph(paragraph, maxChunkChars) {
    if (paragraph.length <= maxChunkChars)
        return [paragraph];
    const sentences = paragraph
        .split(/(?<=[.!?])\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
    if (sentences.length <= 1) {
        return splitLongText(paragraph, maxChunkChars);
    }
    const segments = [];
    let current = '';
    for (const sentence of sentences) {
        if ((current ? `${current} ${sentence}` : sentence).length <= maxChunkChars) {
            current = current ? `${current} ${sentence}` : sentence;
            continue;
        }
        if (current)
            segments.push(current);
        if (sentence.length > maxChunkChars) {
            const pieces = splitLongText(sentence, maxChunkChars);
            segments.push(...pieces.slice(0, -1));
            current = pieces[pieces.length - 1] || '';
        }
        else {
            current = sentence;
        }
    }
    if (current)
        segments.push(current);
    return segments;
}
function getOverlapPrefix(previousChunk, overlapChars) {
    if (overlapChars <= 0 || !previousChunk)
        return '';
    if (previousChunk.length <= overlapChars)
        return previousChunk;
    const slice = previousChunk.slice(previousChunk.length - overlapChars);
    const firstSpace = slice.indexOf(' ');
    return firstSpace >= 0 ? slice.slice(firstSpace + 1).trim() : slice.trim();
}
function chunkText(text, options) {
    const normalized = normalizeText(text);
    if (!normalized)
        return [];
    const maxChunkChars = options?.maxChunkChars || DEFAULT_MAX_CHUNK_CHARS;
    const overlapChars = options?.overlapChars || DEFAULT_OVERLAP_CHARS;
    const minChunkChars = options?.minChunkChars || DEFAULT_MIN_CHUNK_CHARS;
    const paragraphs = splitByParagraphs(normalized);
    const segments = paragraphs.flatMap((p) => splitParagraph(p, maxChunkChars));
    const contentChunks = [];
    let current = '';
    let previousFinalized = '';
    for (const segment of segments) {
        const overlapPrefix = current ? '' : getOverlapPrefix(previousFinalized, overlapChars);
        const segmentWithOverlap = overlapPrefix ? `${overlapPrefix} ${segment}`.trim() : segment;
        const candidate = current ? `${current}\n\n${segmentWithOverlap}` : segmentWithOverlap;
        if (candidate.length <= maxChunkChars) {
            current = candidate;
            continue;
        }
        if (current) {
            contentChunks.push(current.trim());
            previousFinalized = current.trim();
        }
        current = segmentWithOverlap;
        if (current.length > maxChunkChars) {
            const splitPieces = splitLongText(current, maxChunkChars);
            if (splitPieces.length) {
                contentChunks.push(...splitPieces.slice(0, -1).map((s) => s.trim()));
                previousFinalized = splitPieces[splitPieces.length - 2] || previousFinalized;
                current = splitPieces[splitPieces.length - 1] || '';
            }
        }
    }
    if (current)
        contentChunks.push(current.trim());
    const mergedChunks = [];
    for (const chunk of contentChunks) {
        const trimmed = chunk.trim();
        if (!trimmed)
            continue;
        const previous = mergedChunks[mergedChunks.length - 1];
        if (previous && trimmed.length < minChunkChars) {
            mergedChunks[mergedChunks.length - 1] = `${previous}\n\n${trimmed}`.trim();
            continue;
        }
        mergedChunks.push(trimmed);
    }
    return mergedChunks.map((content, chunkIndex) => ({
        chunkIndex,
        content,
        tokenCount: estimateTokens(content),
    }));
}
