import { SgpChampionshipApiData } from 'utils/sgp/championship-api-data';
import { btcc, s4, s7 } from './data/championship-api';

describe('SgpChampionshipApiData', () => {
  it('should trigger an error when trying to create an instance with an invalid json', () => {
    expect(() => SgpChampionshipApiData.fromJson('wrong-json')).toThrow();
    expect(() => SgpChampionshipApiData.fromJson('{}')).toThrow();
    expect(() => SgpChampionshipApiData.fromJson('{"_type":"wrongType"}')).toThrow();
  });

  it('should be able to create an instance from the exported json', () => {
    const json = btcc.toJson();
    const copy = SgpChampionshipApiData.fromJson(json);

    expect(copy).toEqual(btcc);
  });

  it('should retrieve driver numbers from their ids when available', () => {
    const danikazeId = 'lnLbWIqriGvN_KhkL6Quv';
    const dylanId = 'kxF3Ph1pWHKs3E4Ch3ZsS';

    expect(btcc.getDriverNumber('wrong id')).toBeUndefined();

    // Jaryd but AC doesn't have driver numbers
    expect(btcc.getDriverNumber(dylanId)).toBeUndefined();

    expect(s4.getDriverNumber(danikazeId)).toBe(84);
    expect(s4.getDriverNumber(dylanId)).toBe(91);

    expect(s7.getDriverNumber(danikazeId)).toBe(77);
    expect(s7.getDriverNumber(dylanId)).toBe(91);
  });
});
