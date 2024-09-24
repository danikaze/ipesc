/**
 * A season/championship is considered an "official championship"
 * if it's ID (as defined in constants.ts) is like S1..S10...
 */
export function isChampionship(name: string): boolean {
  return /^S\d+$/.test(name);
}
