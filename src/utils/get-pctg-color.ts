export function getPctgColor(pctg: number): string {
  if (pctg < 101) return '#c200cf';
  if (pctg < 102) return '#2b93ff';
  if (pctg < 103) return '#00cf36';
  if (pctg < 104) return '#ffe27a';
  if (pctg < 105) return '#ffb13b';
  if (pctg < 106) return '#ff3b3b';
  if (pctg < 107) return '#c36832';
  if (pctg < 108) return '#602f12';
  return '#222222';
}
