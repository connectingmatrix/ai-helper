import { trim, uniq } from 'lodash';

import { StringLike } from './types';

export function normalizeWhitespace(value: string): string {
  return trim(String(value || '').replace(/\s+/g, ' '));
}

export function stripCodeFence(value: string): string {
  return String(value || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export function stripCodeFences(value: string): string {
  return stripCodeFence(value);
}

export function unique(values: Array<StringLike>): string[] {
  return uniq(values.map((value) => String(value || '').trim()).filter(Boolean));
}

export function extractYears(text: string): string[] {
  const matches = String(text || '').match(/\b(19|20)\d{2}\b/g) || [];
  return uniq(matches);
}

export function toExcerpt(value: StringLike, size = 800): string | null {
  const normalized = normalizeWhitespace(String(value || ''));
  if (!normalized) return null;
  if (normalized.length <= size) return normalized;
  return `${normalized.slice(0, size).trim()}...`;
}
