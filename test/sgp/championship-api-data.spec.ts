import { SgpChampionshipApiData } from 'utils/sgp/championship-api-data';
import { btcc, s4, s7 } from './data/championship-api';
import { SgpGame } from 'utils/sgp/types';

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

  it('should retrieve championship internal ids', () => {
    expect(btcc.getId()).toBe('HmJXSR2OksoGBlT10eR_q');
    expect(s4.getId()).toBe('F3m9W00txELGkFJuUslLM');
    expect(s7.getId()).toBe('u1Alc5D09NQjUNC4xPSVm');
  });

  it('should retrieve championship game', () => {
    expect(btcc.getGame()).toBe(SgpGame.AC);
    expect(s4.getGame()).toBe(SgpGame.ACC);
    expect(s7.getGame()).toBe(SgpGame.ACC);
  });

  it('should retrieve championship names', () => {
    expect(btcc.getName()).toBe(
      'Indo-Pacific Endurance Simulation Challenge #BTCC championship '
    );
    expect(s4.getName()).toBe('IPESC Season 4');
    expect(s7.getName()).toBe('IPESC Season 7');
  });

  it('should retrieve start dates', () => {
    expect(btcc.getStartDate()).toBe('2023-04-27T09:29:54.750Z');
    expect(s4.getStartDate()).toBe('2022-08-23T09:02:38.347Z');
    expect(s7.getStartDate()).toBe('2023-08-08T09:29:54.847Z');
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
