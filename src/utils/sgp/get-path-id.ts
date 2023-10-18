/**
 * Get the last part of the pathname, which usually is the id
 * If `required` is specified, it needs to appear in the pathname
 */
export function getPathId(required?: string): string | undefined {
  if (required && !location.pathname.includes(required)) return;
  return /\/([^/]+)$/.exec(location.pathname)?.[1];
}
