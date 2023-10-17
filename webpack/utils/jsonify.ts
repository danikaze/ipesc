/**
 * Returns an object with the same fields as the provided `obj` but with every
 * value stringified in json
 */
export function jsonify<T extends Record<string, any>>(obj: T): Record<keyof T, string> {
  return Object.entries(obj).reduce(
    (res, [key, value]) => {
      res[key as keyof T] = JSON.stringify(value);
      return res;
    },
    {} as Record<keyof T, string>
  );
}
