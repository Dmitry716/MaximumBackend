export function normalizeToArray(value: string | string[] | number | number[] | undefined): (string | number)[] {
  if (Array.isArray(value)) {
    return value.flatMap(v => `${v}`.split(','));
  }

  if (typeof value === 'string') {
    return value.split(',');
  }

  if (typeof value === 'number') {
    return [value];
  }

  return [];
}
