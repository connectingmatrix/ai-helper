import { JsonObject } from './types';
import { stripCodeFence } from './string-utils';

export function safeJsonParse<T = unknown>(value: string): T | null {
  if (!value) return null;
  const cleaned = stripCodeFence(value);
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned) as T;
  } catch (_error) {
    return null;
  }
}

export function safeParseJson<T = unknown>(value: string): T | null {
  return safeJsonParse<T>(value);
}

export function tryParseJson<T = unknown>(text: string): T | null {
  return safeJsonParse<T>(text);
}

export function gatherStringValues(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(gatherStringValues);
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(gatherStringValues);
  }
  return [];
}

export function normalizeMetadata(metadata: unknown): JsonObject | null {
  if (metadata === null || metadata === undefined || metadata === '') return null;

  if (typeof metadata === 'object') {
    return metadata as JsonObject;
  }

  if (typeof metadata === 'string') {
    const parsed = safeJsonParse<JsonObject>(metadata);
    if (parsed && typeof parsed === 'object') return parsed;
    return { raw_metadata: metadata };
  }

  return null;
}
