const SEC_TO_MS = 1000;
const MIN_TO_MS = 60 * SEC_TO_MS;
const HOUR_TO_MS = 60 * MIN_TO_MS;
const MOD = 60;

interface MsToTimeOptions {
  /**
   * undefined = show only if there are hours (default)
   * boolean = force show or hide
   */
  hours?: boolean;
  /**
   * `true` - show the minutes (default)
   * `false` - hide the minutes  (it will hide the hours too)
   */
  min?: boolean;
  /**
   * `true` - show the milliseconds (default)
   * `false` - hide the milliseconds
   */
  ms?: boolean;
}

export function timeToMs(time: string | undefined): number | undefined {
  if (!time) return;
  const match = /((\d+):)?(\d+):(\d+)(\.(\d+))?/.exec(time);
  if (!match) return;
  const [, , hours, min, sec, , ms] = match;
  return (
    (Number(ms?.padEnd(3, '0').substring(0, 3)) || 0) +
    (Number(sec) || 0) * SEC_TO_MS +
    (Number(min) || 0) * MIN_TO_MS +
    (Number(hours) || 0) * HOUR_TO_MS
  );
}

export function msToTime(
  time: number | undefined,
  options?: MsToTimeOptions
): string | undefined {
  if (time === undefined || isNaN(time) || time < 0) return;
  const opt = {
    hours: undefined,
    ms: true,
    min: true,
    ...options,
  };

  const ms = Math.round(time % SEC_TO_MS);
  const s = Math.floor(time / SEC_TO_MS) % MOD;
  const m = Math.floor(time / MIN_TO_MS) % MOD;
  const h = Math.floor(time / HOUR_TO_MS);

  const fms = opt.ms ? `.${ms.toString().padStart(3, '0')}` : '';
  const fs = s.toString().padStart(opt.min ? 2 : 1, '0');
  const fm = opt.min ? m.toString().padStart(h ? 2 : 1, '0') + ':' : '';
  const fh = opt.min && (opt.hours || (opt.hours === undefined && h)) ? `${h}:` : '';

  return `${fh}${fm}${fs}${fms}`;
}
