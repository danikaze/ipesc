import { DriverInfo, SgpEventApiData } from 'utils/sgp/event-api-data';
import { SgpCategory, SgpEventType, SgpGame } from 'utils/sgp/types';
import {
  btccRace,
  s4singleRace,
  s7fullSingleRace,
  s7fullDoubleSprint,
} from './data/event-api';

describe('SgpEventApiData', () => {
  it('should trigger an error when trying to create an instance with an invalid json', () => {
    expect(() => SgpEventApiData.fromJson('wrong-json')).toThrow();
    expect(() => SgpEventApiData.fromJson('{}')).toThrow();
    expect(() => SgpEventApiData.fromJson('{"_type":"wrongType"}')).toThrow();
  });

  it('should be able to create an instance from the exported json', () => {
    const json = s7fullSingleRace.toJson();
    const copy = SgpEventApiData.fromJson(json);

    expect(copy).toEqual(s7fullSingleRace);
  });

  it('should get the championship name', () => {
    expect(btccRace.getChampionshipName()).toBe(
      'Indo-Pacific Endurance Simulation Challenge #BTCC championship '
    );
    expect(s4singleRace.getChampionshipName()).toBe('IPESC Season 4');
    expect(s7fullSingleRace.getChampionshipName()).toBe('IPESC Season 7');
    expect(s7fullDoubleSprint.getChampionshipName()).toBe('IPESC Season 7');
  });

  it('should get the event game', () => {
    expect(btccRace.getGame()).toBe(SgpGame.AC);
    expect(s4singleRace.getGame()).toBe(SgpGame.ACC);
    expect(s7fullSingleRace.getGame()).toBe(SgpGame.ACC);
    expect(s7fullDoubleSprint.getGame()).toBe(SgpGame.ACC);
  });

  it('should get the track id and name', () => {
    expect(btccRace.getTrackId()).toBe('ks_silverstone::national');
    expect(btccRace.getTrackName()).toBe('Silverstone - National');

    expect(s4singleRace.getTrackId()).toBe('silverstone');
    expect(s4singleRace.getTrackName()).toBe('Silverstone');

    expect(s7fullSingleRace.getTrackId()).toBe('suzuka');
    expect(s7fullSingleRace.getTrackName()).toBe('Suzuka');

    expect(s7fullDoubleSprint.getTrackId()).toBe('brands_hatch');
    expect(s7fullDoubleSprint.getTrackName()).toBe('Brands Hatch');
  });

  it('should get the event name', () => {
    expect(btccRace.getEventName()).toBe('IPESC BTCC | Silverstone National');
    expect(s4singleRace.getEventName()).toBe('Rnd 2 Silverstone (WET) ');
    expect(s7fullSingleRace.getEventName()).toBe('Rnd 2 Suzuka');
    expect(s7fullDoubleSprint.getEventName()).toBe('Rnd 6 Brands Hatch Sprint Round');
  });

  it('should get the number of races', () => {
    expect(btccRace.getNumberOfRaces()).toBe(1);
    expect(s4singleRace.getNumberOfRaces()).toBe(1);
    expect(s7fullSingleRace.getNumberOfRaces()).toBe(1);
    expect(s7fullDoubleSprint.getNumberOfRaces()).toBe(2);
  });

  it('should get the list of categories', () => {
    const allCategories = [SgpCategory.PRO, SgpCategory.SILVER, SgpCategory.AM];
    expect(btccRace.getCategoryList()).toBeUndefined();
    expect(s4singleRace.getCategoryList()).toBeUndefined();
    expect(s7fullSingleRace.getCategoryList()).toEqual(allCategories);
    expect(s7fullDoubleSprint.getCategoryList()).toEqual(allCategories);
  });

  it('should get the list of drivers that joined the event', () => {
    let drivers: DriverInfo[];

    drivers = btccRace.getDrivers('active');
    expect(drivers.length).toBe(6);
    expect(drivers).toContainEqual({
      id: 'QQMAMmgupkQFwRFx0wAPD',
      name: 'Isaac Becker',
      country: 'AU',
      avatarUrl:
        'https://avatars.steamstatic.com/cfaf6917f47ca6122396f46e485a79a090f29fa0_medium.jpg',
      carModelId: 'pm3dm_volvo_s40_btcc',
      // category: undefined,
    });

    drivers = s4singleRace.getDrivers('active');
    expect(drivers.length).toBe(27);
    expect(drivers).toContainEqual({
      id: 'lhx1cWMLlA5rwp--60xP5',
      name: 'O-Ring Boland',
      country: 'AU',
      avatarUrl:
        'https://avatars.steamstatic.com/1f34c4ae8341589eb1af0d3dd8eb2560a904da43_medium.jpg',
      carModelId: '20',
      // category: undefined,
    });

    drivers = s7fullSingleRace.getDrivers('active');
    expect(drivers.length).toBe(34);
    expect(drivers).toContainEqual({
      id: 'kGuyp0gCE7ynLuDvqjhxZ',
      name: 'Damario Haznam',
      country: 'ID',
      avatarUrl:
        'https://avatars.steamstatic.com/9a49bb038594e36872410778e029fe441e6cccbf_medium.jpg',
      carModelId: '30',
      category: 'PRO',
    });
  });

  it(`should get the list of drivers that didn't join the event`, () => {
    let drivers: DriverInfo[];

    drivers = btccRace.getDrivers('inactive');
    expect(drivers.length).toBe(10);
    expect(drivers.find((d) => d.name === 'Isaac Becker')).toBeUndefined();

    drivers = s4singleRace.getDrivers('inactive');
    expect(drivers.length).toBe(12);
    expect(drivers.find((d) => d.name === 'O-Ring Boland')).toBeUndefined();

    drivers = s7fullSingleRace.getDrivers('inactive');
    expect(drivers.length).toBe(8);
    expect(drivers.find((d) => d.name === 'Damario Haznam')).toBeUndefined();
  });

  it('should get race results', () => {
    expect(btccRace.getResults(SgpEventType.QUALI)!.results[0]).toEqual({
      averageCleanLapTime: 77260,
      averageLapTime: 77260,
      bestCleanLap: 12,
      bestCleanLapTime: 57911,
      bestLap: 12,
      bestLapTime: 57911,
      carId: '3',
      carModelId: 'pm3dm_volvo_s40_btcc',
      carName: 'Volvo S40 BTCC',
      carSkinId: 'ATCC_99_03',
      category: undefined,
      cleanLapCount: 15,
      driverId: 'QQMAMmgupkQFwRFx0wAPD',
      incidents: {
        collisionsUnclassified: 0,
        collisionsWithCar: 0,
        collisionsWithEnv: 0,
        offTracks: 0,
        pitSpeeding: 0,
        spins: 0,
      },
      lapCount: 15,
      participant: {
        avatarUrl:
          'https://avatars.steamstatic.com/cfaf6917f47ca6122396f46e485a79a090f29fa0_medium.jpg',
        country: 'AU',
        id: 'QQMAMmgupkQFwRFx0wAPD',
        name: 'Isaac Becker',
        type: 'DRIVER',
      },
      penalties: 0,
      points: 20,
      pointsAdjustment: 0,
      pointsTotal: 20,
      position: 1,
      qualified: true,
      totalCleanTime: 1158899,
      totalTime: 1161387,
    });

    function getPodiumNames(
      data: SgpEventApiData,
      type: SgpEventType,
      raceIndex?: number
    ) {
      return data
        .getResults(type, raceIndex)!
        .results.slice(0, 3)
        .map((res) => res.participant.name);
    }

    expect(getPodiumNames(s4singleRace, SgpEventType.PRACTICE)).toEqual([
      'Damario Haznam',
      'Stacks McGavin',
      'Nico Cappa',
    ]);
    expect(getPodiumNames(s4singleRace, SgpEventType.QUALI)).toEqual([
      'Rialto Ristofani',
      'Damario Haznam',
      'Stacks McGavin',
    ]);
    expect(getPodiumNames(s4singleRace, SgpEventType.RACE)).toEqual([
      'Rialto Ristofani',
      'Stacks McGavin',
      'Mitch Legge',
    ]);

    expect(getPodiumNames(s7fullSingleRace, SgpEventType.PRACTICE)).toEqual([
      'Damario Haznam',
      'Will Hammond',
      'Aryadi Wishnu',
    ]);
    expect(getPodiumNames(s7fullSingleRace, SgpEventType.QUALI)).toEqual([
      'Damario Haznam',
      'Will Hammond',
      'Fladdy Malik',
    ]);
    expect(getPodiumNames(s7fullSingleRace, SgpEventType.RACE)).toEqual([
      'Damario Haznam',
      'William Sunjoto',
      'Nico Cappa',
    ]);

    expect(getPodiumNames(s7fullDoubleSprint, SgpEventType.RACE, 0)).toEqual([
      'Damario Haznam',
      'Daffa  Ardiansa',
      'Isaac Becker',
    ]);
    expect(getPodiumNames(s7fullDoubleSprint, SgpEventType.RACE, 1)).toEqual([
      'Daffa  Ardiansa',
      'Damario Haznam',
      'Isaac Becker',
    ]);
  });

  it('should get car information from its id', () => {
    expect(btccRace.getCar('pm3dm_volvo_s40_btcc')).toEqual({
      id: 'pm3dm_volvo_s40_btcc',
      name: 'Volvo S40 BTCC',
    });
    expect(s4singleRace.getCar('20')).toEqual({
      id: '20',
      name: 'AMR V8 Vantage (2019)',
    });
    expect(s4singleRace.getCar('30')).toEqual({
      id: '30',
      name: 'BMW M4 GT3',
    });
  });
});
