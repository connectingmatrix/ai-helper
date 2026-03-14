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

const DEFAULT_MAX_CHUNK_CHARS = 1200;
const DEFAULT_OVERLAP_CHARS = 180;
const DEFAULT_MIN_CHUNK_CHARS = 120;

function estimateTokens(text: string) {
  const normalized = text.trim();
  if (!normalized) return 0;
  return Math.max(1, Math.ceil(normalized.length / 4));
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/\u00a0/g, ' ').trim();
}

function splitByParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitLongText(text: string, maxChunkChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChunkChars) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    current = word;
  }

  if (current) chunks.push(current);
  return chunks;
}

function splitParagraph(paragraph: string, maxChunkChars: number): string[] {
  if (paragraph.length <= maxChunkChars) return [paragraph];

  const sentences = paragraph
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return splitLongText(paragraph, maxChunkChars);
  }

  const segments: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current ? `${current} ${sentence}` : sentence).length <= maxChunkChars) {
      current = current ? `${current} ${sentence}` : sentence;
      continue;
    }

    if (current) segments.push(current);

    if (sentence.length > maxChunkChars) {
      const pieces = splitLongText(sentence, maxChunkChars);
      segments.push(...pieces.slice(0, -1));
      current = pieces[pieces.length - 1] || '';
    } else {
      current = sentence;
    }
  }

  if (current) segments.push(current);
  return segments;
}

function getOverlapPrefix(previousChunk: string, overlapChars: number): string {
  if (overlapChars <= 0 || !previousChunk) return '';
  if (previousChunk.length <= overlapChars) return previousChunk;

  const slice = previousChunk.slice(previousChunk.length - overlapChars);
  const firstSpace = slice.indexOf(' ');
  return firstSpace >= 0 ? slice.slice(firstSpace + 1).trim() : slice.trim();
}

export function chunkText(text: string, options?: ChunkingOptions): ChunkUnit[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const maxChunkChars = options?.maxChunkChars || DEFAULT_MAX_CHUNK_CHARS;
  const overlapChars = options?.overlapChars || DEFAULT_OVERLAP_CHARS;
  const minChunkChars = options?.minChunkChars || DEFAULT_MIN_CHUNK_CHARS;

  const paragraphs = splitByParagraphs(normalized);
  const segments = paragraphs.flatMap((p) => splitParagraph(p, maxChunkChars));

  const contentChunks: string[] = [];
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

  if (current) contentChunks.push(current.trim());

  const mergedChunks: string[] = [];
  for (const chunk of contentChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

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
