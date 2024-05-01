import { ReactNode } from 'react';

export function formatRatioAsPctg(n: number, decimalPoints = 2): string {
  return (n * 100).toFixed(decimalPoints) + '%';
}

export function formatAsNth(n: number): ReactNode {
  const str = String(n);
  const last = str[str.length - 1];

  const post = last === '1' ? 'st' : last === '2' ? 'nd' : last === '3' ? 'rd' : 'th';

  return (
    <>
      {n}
      <sup>{post}</sup>
    </>
  );
}
