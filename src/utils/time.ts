const SEC_TO_MS = 1000;
const MIN_TO_MS = 60 * SEC_TO_MS;
const HOUR_TO_MS = 60 * MIN_TO_MS;
const MOD = 60;

export function timeToMs(time: string | undefined): number | undefined {
  if (!time) return;
  const match = /((\d+):)?(\d+):(\d+)(\.(\d+))?/.exec(time);
  if (!match) return;
  const [m1, m2, hours, min, sec, m3, ms] = match;
  return (
    (Number(ms?.padEnd(3, '0').substring(0, 3)) || 0) +
    (Number(sec) || 0) * SEC_TO_MS +
    (Number(min) || 0) * MIN_TO_MS +
    (Number(hours) || 0) * HOUR_TO_MS
  );
}

export function msToTime(time: number | undefined): string | undefined {
  if (time === undefined || isNaN(time) || time < 0) return;

  const ms = Math.round(time % SEC_TO_MS);
  const s = Math.floor(time / SEC_TO_MS) % MOD;
  const m = Math.floor(time / MIN_TO_MS) % MOD;
  const h = Math.floor(time / HOUR_TO_MS);

  const fms = `${ms.toString().padStart(3, '0')}`;
  const fs = s.toString().padStart(2, '0');
  const fm = m.toString().padStart(h ? 2 : 1, '0');
  const fh = h ? `${h}:` : '';

  return `${fh}${fm}:${fs}.${fms}`;
}
