// defined in `webpack/pages` via `get-fns-define.ts`
const sources = process.env.DIST_FNS as unknown as Record<string, string>;

/**
 * This are the names of the generated dist-fns files without extension
 * Should match with the files on `src/fns`
 */
type FnSource = 'ipesc-helpers.user';

/**
 * Accessor to `DIST_FNS` so it doesn't get duplicated in the built code
 */
export function getFnSource(filename: FnSource): string {
  return sources[filename];
}
