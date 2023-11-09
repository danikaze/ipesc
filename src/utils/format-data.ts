export function formatRatioAsPctg(n: number, decimalPoints = 2): string {
  return (n * 100).toFixed(decimalPoints) + '%';
}
