const SEC_TO_MS = 1000;
const MIN_TO_MS = 60 * SEC_TO_MS;
const HOUR_TO_MS = 60 * MIN_TO_MS;

export function timeToMs(time: string | undefined): number | undefined {
  if (!time) return;
  const match = /((\d+):)?(\d+):(\d+)(\.(\d+))?/.exec(time);
  if (!match) return;
  const [m1, m2, hours, min, sec, m3, ms] = match;
  return (
    (Number(ms) || 0) +
    (Number(sec) || 0) * SEC_TO_MS +
    (Number(min) || 0) * MIN_TO_MS +
    (Number(hours) || 0) * HOUR_TO_MS
  );
}
