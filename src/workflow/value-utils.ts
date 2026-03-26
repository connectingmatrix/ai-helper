import { safeJsonParse } from '../json-utils';
import { toNumberOrNull } from '../number-utils';

export const isObjectRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

export const parseRecordValue = (value: unknown): Record<string, unknown> => (
  isObjectRecord(value) ? value : {}
);

export const parseStringValue = (value: unknown): string => (
  typeof value === 'string' ? value : String(value ?? '')
);

export const parseNumberValue = (value: unknown, fallback: number): number => {
  const parsed = toNumberOrNull(value);
  return parsed === null ? fallback : parsed;
};

export const parseFiniteNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parsePositiveInteger = (value: unknown): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  const rounded = Math.trunc(parsed);
  return rounded > 0 ? rounded : undefined;
};

export const parseBooleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  const normalized = parseStringValue(value).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

export const parseStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : parseStringValue(item).trim()))
    .filter((item) => item.length > 0);
};

export const parseUnknownArray = (value: unknown): unknown[] => (
  Array.isArray(value) ? value : []
);

export const parseHeaderRecord = (value: unknown): Record<string, string> => {
  if (isObjectRecord(value)) {
    return Object.entries(value).reduce<Record<string, string>>((acc, [key, item]) => {
      acc[key] = parseStringValue(item);
      return acc;
    }, {});
  }

  if (typeof value !== 'string') return {};

  const parsed = safeJsonParse<unknown>(value);
  if (!parsed) return {};
  return parseHeaderRecord(parsed);
};

export const parseEditableStringValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || typeof value === 'undefined') return '';

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const formatPropertyLabel = (fieldKey: string): string => {
  const normalized = fieldKey
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!normalized) return 'Field';

  return normalized
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};
