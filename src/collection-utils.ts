import { toSafeString } from './safe-utils';

export function sortRows<T extends Record<string, any>>(
  rows: T[],
  orderBy?: Array<Record<string, string>> | null,
): T[] {
  const [firstOrder] = Array.isArray(orderBy) ? orderBy : [];
  if (!firstOrder) return rows;
  const [field, direction] = Object.entries(firstOrder)[0] || [];
  if (!field || !direction) return rows;
  const normalizedDirection = String(direction).toLowerCase();

  return [...rows].sort((left, right) => {
    const leftValue = left[field];
    const rightValue = right[field];
    if (leftValue === rightValue) return 0;
    if (leftValue == null) return normalizedDirection.includes('desc') ? 1 : -1;
    if (rightValue == null) {
      return normalizedDirection.includes('desc') ? -1 : 1;
    }
    if (leftValue > rightValue) {
      return normalizedDirection.includes('desc') ? -1 : 1;
    }
    return normalizedDirection.includes('desc') ? 1 : -1;
  });
}

export function filterEq<T>(
  rows: T[],
  selector: (item: T) => unknown,
  expected: unknown,
): T[] {
  if (typeof expected === 'undefined' || expected === null) return rows;
  return rows.filter((item) => selector(item) === expected);
}

export function filterIlike<T>(
  rows: T[],
  selector: (item: T) => unknown,
  expected: unknown,
): T[] {
  const normalized = toSafeString(expected).toLowerCase().replace(/%/g, '');
  if (!normalized) return rows;
  return rows.filter((item) =>
    toSafeString(selector(item)).toLowerCase().includes(normalized),
  );
}
