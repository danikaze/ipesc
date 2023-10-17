import { timeToMs } from '../src/utils/sgp/time-to-ms';

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
