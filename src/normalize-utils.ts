import {
  toSafeBoolean,
  toSafeString,
} from './safe-utils';

type NormalizeFieldMeta = {
  prop: string;
  sourceKey?: string;
};

type ReflectWithMetadata = typeof Reflect & {
  getMetadata?: (
    metadataKey: unknown,
    target: object,
    propertyKey: string,
  ) => unknown;
};

const normalizeFieldStore = new WeakMap<object, NormalizeFieldMeta[]>();
const reflectWithMetadata = Reflect as ReflectWithMetadata;

export type ClassType<T extends Record<string, any>> = new () => T;

export type NormalizeOptions<T extends Record<string, any>> = {
  defaults?: Partial<T>;
  transforms?: Partial<{
    [K in keyof T]: (value: unknown, raw: Record<string, unknown>) => T[K];
  }>;
};

export function NormalizeField(sourceKey?: string): PropertyDecorator {
  return (target, propertyKey) => {
    const existing = normalizeFieldStore.get(target) || [];
    const next = existing.filter(
      (entry) => entry.prop !== String(propertyKey),
    );
    next.push({
      prop: String(propertyKey),
      sourceKey,
    });
    normalizeFieldStore.set(target, next);
  };
}

function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, segment: string) =>
    segment.toUpperCase(),
  );
}

function getNormalizeFieldMeta(target: object): NormalizeFieldMeta[] {
  const fromStore = normalizeFieldStore.get(target);
  return fromStore || [];
}

export function normalize<T extends Record<string, any>>(
  payload: unknown,
  TypeClass: ClassType<T>,
  options?: NormalizeOptions<T>,
): Partial<T> {
  const raw =
    payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const out = { ...(options?.defaults || {}) } as Partial<T>;
  const fieldMeta = getNormalizeFieldMeta(TypeClass.prototype);

  const sourceToProp = new Map<string, string>();
  fieldMeta.forEach((entry) => {
    sourceToProp.set(entry.sourceKey || entry.prop, entry.prop);
  });

  for (const [rawKey, rawValue] of Object.entries(raw)) {
    const prop = sourceToProp.get(rawKey) || toCamelCase(rawKey);
    const custom = options?.transforms?.[prop as keyof T];
    let next: unknown = rawValue;

    if (custom) {
      next = custom(rawValue, raw);
    } else {
      const designType = reflectWithMetadata.getMetadata?.(
        'design:type',
        TypeClass.prototype,
        prop,
      );

      if (designType === Boolean) {
        next = toSafeBoolean(rawValue);
      } else if (designType === String) {
        next = toSafeString(rawValue);
      }
    }

    (out as Record<string, unknown>)[prop] = next;
  }

  return out;
}
