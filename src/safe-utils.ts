export function toSafeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function toOptionalString(value: unknown): string | null {
  const normalized = toSafeString(value);
  return normalized || null;
}

export function toSafeBoolean(value: unknown): boolean {
  return value === true;
}

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
