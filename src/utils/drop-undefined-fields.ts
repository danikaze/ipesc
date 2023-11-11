export function dropUndefinedFields<T>(data: T): T {
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(dropUndefinedFields) as T;

  return Object.entries(data as {}).reduce((res, [key, value]) => {
    if (value === undefined || value === null) return res;
    (res as any)[key] = dropUndefinedFields(value);
    return res;
  }, {} as T);
}
