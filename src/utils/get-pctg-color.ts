const COLORS = [
  // < 101%
  '#c200cf',
  // < 102%
  '#2b93ff',
  // < 103%
  '#00cf36',
  // < 104%
  '#ffe27a',
  // < 105%
  '#ffb13b',
  // < 106%
  '#ff3b3b',
  // < 107%
  '#c36832',
  // >= 107%
  '#602f12',
];

export function getPctgColor(pctg: number, fullGradient?: boolean): string {
  const index = Math.min(COLORS.length - 1, Math.floor(pctg) - 100);
  if (!fullGradient) {
    return COLORS[index];
  }
  const nextIndex = Math.min(COLORS.length - 1, index + 1);
  if (nextIndex === index) return COLORS[index];

  const c0 = hex2rgb(COLORS[index]);
  const c1 = hex2rgb(COLORS[nextIndex]);
  const interpolatedColor = interpolateColor(c0, c1, pctg - 100 - index);
  return rgb2hex(interpolatedColor);
}

export interface ColorRgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type ColorHex = string;

function hex2rgb(hexColor: ColorHex) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4), 16);
  return { r, g, b };
}

function rgb2hex(rgbaColor: ColorRgba): ColorHex {
  const r = Math.round(rgbaColor.r).toString(16).padStart(2, '0');
  const g = Math.round(rgbaColor.g).toString(16).padStart(2, '0');
  const b = Math.round(rgbaColor.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function interpolateColor(c0: ColorRgba, c1: ColorRgba, ratio: number): ColorRgba {
  const t = Math.max(0, Math.min(ratio, 1));
  return {
    r: interpolate(c0.r, c1.r, t),
    g: interpolate(c0.g, c1.g, t),
    b: interpolate(c0.b, c1.b, t),
    a: interpolate(c0.a ?? 1, c1.a ?? 1, t),
  };
}

function interpolate(a: number, b: number, t: number): number {
  const d = b - a;
  return a + d * t;
}
