export function plural(singular: string, n: number): string {
  return `${singular}${n === 1 ? '' : 's'}`;
}

export function count(singular: string, n: number): string {
  return `${n} ${plural(singular, n)}`;
}
