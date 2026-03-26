import {
  toSafeBoolean,
  toOptionalString,
} from './safe-utils';

type ReflectWithMetadata = typeof Reflect & {
  getMetadata?: (
    metadataKey: unknown,
    target: object,
    propertyKey: string,
  ) => unknown;
};

const reflectWithMetadata = Reflect as ReflectWithMetadata;

export type ClassType<T extends Record<string, any>> = new () => T;

function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, segment: string) =>
    segment.toUpperCase(),
  );
}

export function normalize<T extends Record<string, any>>(
  payload: unknown,
  TypeClass: ClassType<T>,
): Partial<T> {
  const raw =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const out = {} as Partial<T>;

  for (const [rawKey, rawValue] of Object.entries(raw)) {
    const prop = toCamelCase(rawKey);
    let next: unknown = rawValue;

    const designType = reflectWithMetadata.getMetadata?.(
      'design:type',
      TypeClass.prototype,
      prop,
    );

    if (designType === Boolean) {
      next = toSafeBoolean(rawValue);
    } else if (designType === String) {
      next = toOptionalString(rawValue);
    }

    (out as Record<string, unknown>)[prop] = next;
  }

  return out;
}
