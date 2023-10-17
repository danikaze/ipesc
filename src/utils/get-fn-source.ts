// defined in `webpack/pages` via `get-fns-define.ts`
const sources = process.env.DIST_FNS as unknown as Record<string, string>;

/**
 * Accessor to `DIST_FNS` so it doesn't get duplicated in the built code
 */
export function getFnSource(filename: string): string | undefined {
  return sources[filename];
}
