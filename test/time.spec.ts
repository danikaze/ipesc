import { timeToMs, msToTime } from '../src/utils/time';

describe('timeToMs', () => {
  it('should return undefined on invalid data', () => {
    expect(timeToMs(undefined)).toBeUndefined();
    expect(timeToMs('invalid time')).toBeUndefined();
    expect(timeToMs('123.456')).toBeUndefined();
  });

  it('should parse min:sec', () => {
    expect(timeToMs('1:23')).toBe(60_000 + 23_000);
  });

  it('should parse min:sec.ms', () => {
    expect(timeToMs('1:23.456')).toBe(60_000 + 23_000 + 456);
  });

  it('should parse hour:min:sec', () => {
    expect(timeToMs('00:01:23')).toBe(60_000 + 23_000);
    expect(timeToMs('01:02:34')).toBe(3_600_000 + 120_000 + 34_000);
  });

  it('should parse hour:min:sec.ms', () => {
    expect(timeToMs('00:01:23.456')).toBe(60_000 + 23_000 + 456);
    expect(timeToMs('01:02:34.567')).toBe(3_600_000 + 120_000 + 34_000 + 567);
  });
});

describe('msToTime', () => {
  it('should return undefined on invalid data', () => {
    expect(msToTime(undefined)).toBeUndefined();
    expect(msToTime(-1)).toBeUndefined();
    expect(msToTime(NaN)).toBeUndefined();
  });

  it('should print only ms', () => {
    expect(msToTime(1)).toBe('0:00.001');
    expect(msToTime(12)).toBe('0:00.012');
    expect(msToTime(123)).toBe('0:00.123');
  });

  it('should print time with 0 ms', () => {
    expect(msToTime(23_000)).toBe('0:23.000');
    expect(msToTime(60_000 + 23_000)).toBe('1:23.000');
  });

  it('should print min:sec.ms', () => {
    expect(msToTime(60_000 + 456)).toBe('1:00.456');
    expect(msToTime(60_000 + 23_000 + 456)).toBe('1:23.456');
  });

  it('should print hour:min:sec', () => {
    expect(msToTime(3_600_000 + 120_000 + 34_000)).toBe('1:02:34.000');
    expect(msToTime(3_600_000 + 120_000 + 34_000 + 123)).toBe('1:02:34.123');
  });
});
