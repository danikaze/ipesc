import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { sync as mkdirpSync } from 'mkdirp';

import { SgpChampionshipApiData } from 'utils/sgp/championship-api-data';
import { SgpCategory, SgpEventType, SgpGame } from 'utils/sgp/types';
import { SgpEventApiData } from 'utils/sgp/event-api-data';
import { Timestamp } from 'utils/types';

import {
  CUSTOM_NAMES,
  OUTPUT_FILE,
  RAW_DATA_DIR,
  ROOT_PATH,
  TRACK_MAX_BEST_TIMES,
} from './constants';
import {
  Car,
  Category,
  Championship,
  Driver,
  Event,
  Game,
  ProcessedData,
  TrackBestData,
  TrackData,
} from './types';

/**
 * Creates the needed & used data for the graphical representation from the big
 * raw data files, with only the needed parts
 */
export function processData(): void {
  console.log(
    `Processing data for ${
      process.env.NODE_ENV === 'production' ? 'production' : 'development'
    } from ${relativePath(RAW_DATA_DIR)}`
  );

  const rawData = readRawFiles();
  const processedData = processRawData(rawData);
  writeProcessedData(processedData);

  console.log('');
}

function relativePath(path: string): string {
  return relative(ROOT_PATH, path).replace(/\\/g, '/');
}

function readRawFiles(): SgpChampionshipApiData[] {
  const data = readdirSync(RAW_DATA_DIR)
    .map((file) => {
      const path = join(RAW_DATA_DIR, file);
      try {
        const json = readFileSync(path).toString();
        const raw = JSON.parse(json);
        const apiData = SgpChampionshipApiData.fromJson(raw);
        console.log(`  - Read ${relativePath(path)} (${json.length} bytes)`);
        return apiData;
      } catch (e) {
        console.error(`  - Error processing ${relativePath(path)}:`, e);
      }
    })
    .filter(Boolean) as SgpChampionshipApiData[];

  data.sort(
    (a, b) => new Date(a.getStartDate()).getTime() - new Date(b.getStartDate()).getTime()
  );
  return data;
}

function writeProcessedData(data: ProcessedData): void {
  try {
    const str =
      process.env.NODE_ENV === 'production'
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 2);
    mkdirpSync(dirname(OUTPUT_FILE));
    writeFileSync(OUTPUT_FILE, str);
    console.log(`Processed data into ${relativePath(OUTPUT_FILE)} (${str.length} bytes)`);
  } catch (e) {
    console.error(`Error writing ${relativePath(OUTPUT_FILE)}:`, e);
  }
}

function processRawData(rawData: SgpChampionshipApiData[]): ProcessedData {
  const processedData: ProcessedData = {
    processedOn: Date.now(),
    drivers: getAllDrivers(rawData),
    cars: getAllCars(rawData),
    championships: getChampionships(rawData),
    tracks: getTrackData(rawData),
  };

  return processedData;
}

function getChampionships(rawData: SgpChampionshipApiData[]): Championship[] {
  return rawData.map((championship) => ({
    id: championship.getId(),
    game: sgpGame2Game(championship.getGame()),
    name: championship.getName(),
    customName: getChampionshipCustomName(championship),
    startTime: new Date(championship.getStartDate()).getTime(),
    drivers: championship.getDrivers().map((driver) => {
      const data: Championship['drivers'][number] = {
        id: driver.id,
        carId: driver.carId,
        raced: championship
          .getEvents()
          .some((ev) =>
            ev.getDrivers('active').find((eventDriver) => eventDriver.id === driver.id)
          ),
      };

      if (driver.raceNumber !== undefined) {
        data.raceNumber = driver.raceNumber;
      }
      if (sgpCategory2Category(driver.category)) {
        data.category = sgpCategory2Category(driver.category);
      }

      return data;
    }),
    events: getEvents(rawData, championship.getId()),
  }));
}

function getChampionshipCustomName(
  championship: SgpChampionshipApiData
): string | undefined {
  const res = CUSTOM_NAMES[championship.getId()];
  if (!res) {
    console.warn(
      `Championship with ID "${championship.getId()}" doesn't have a custom name.`
    );
  }
  return res;
}

function getAllDrivers(rawData: SgpChampionshipApiData[]): Driver[] {
  const map = rawData.reduce((map, championship) => {
    return championship.getDrivers().reduce((map, driver) => {
      if (!map.has(driver.id)) {
        map.set(driver.id, {
          id: driver.id,
          name: driver.name,
          country: driver.country,
        });
      }
      return map;
    }, map);
  }, new Map<Driver['id'], Driver>());

  return Array.from(map.values());
}

function getAllCars(rawData: SgpChampionshipApiData[]): Car[] {
  const map = rawData.reduce((map, championship) => {
    return championship.getCars().reduce((map, car) => {
      if (!map.has(car.id)) {
        map.set(car.id, {
          id: car.id,
          name: car.name!,
        });
      }
      return map;
    }, map);
  }, new Map<Car['id'], Car>());

  return Array.from(map.values());
}

function getEvents(
  rawData: SgpChampionshipApiData[],
  championshipId: Championship['id']
): Event[] {
  const championship = rawData.find((c) => c.getId() === championshipId)!;
  return championship.getEvents().map((event) => ({
    name: event.getEventName(),
    startTime: new Date(event.getStartDate()).getTime(),
    trackId: event.getTrackId(),
    activeDrivers: event.getDrivers('active').map((driver) => driver.id),
    inactiveDrivers: event.getDrivers('inactive').map((driver) => driver.id),
  }));
}

function getTrackData(rawData: SgpChampionshipApiData[]): TrackData[] {
  const res: Map<string, TrackData> = new Map();

  rawData.forEach((championship) => {
    championship.getEvents().forEach((ev) => {
      const eventDate = new Date(ev.getStartDate()).getTime();
      const key = `${ev.getTrackId()}:${ev.getAccVersion()}`;
      const data: TrackData = res.get(key) || {
        id: ev.getTrackId(),
        name: ev.getTrackName(),
        game: sgpGame2Game(ev.getGame()),
        best: {
          quali: [],
          race: [],
        },
      };
      const version = ev.getAccVersion();
      if (version) {
        data.version = version;
      }
      res.set(key, data);

      const quali = ev.getResults(SgpEventType.QUALI);
      if (quali) {
        data.best.quali = updateTrackResults(data.best.quali, quali, eventDate);
      }

      for (let i = 0; ; i++) {
        try {
          const race = ev.getResults(SgpEventType.RACE, i);
          if (!race) return;
          data.best.race = updateTrackResults(data.best.race, race, eventDate);
        } catch (e) {
          break;
        }
      }
    });
  });

  return Array.from(res.values());
}

function updateTrackResults(
  existing: TrackBestData[],
  results: Exclude<ReturnType<SgpEventApiData['getResults']>, undefined>,
  date: Timestamp
): TrackBestData[] {
  results.results.forEach((result) => {
    const lapTime = result.bestCleanLapTime;
    if (!lapTime) return;
    const newData: TrackBestData = {
      lapTime,
      date,
      driverId: result.driverId,
      carId: result.carModelId,
    };
    const index = existing.findIndex((item) => item.driverId === newData.driverId);
    if (index !== -1) {
      if (newData.lapTime < existing[index].lapTime) {
        existing[index] = newData;
      }
    } else {
      existing.push(newData);
    }
  });
  existing.sort((a, b) => a.lapTime - b.lapTime);
  return existing.slice(0, TRACK_MAX_BEST_TIMES);
}

function sgpGame2Game(game: SgpGame | undefined): Game | undefined {
  if (game === SgpGame.ACC) return Game.ACC;
  if (game === SgpGame.AC) return Game.AC;
  if (game === SgpGame.RACE_ROOM) return Game.RACE_ROOM;
  if (game === SgpGame.AUTOMOBILISTA_2) return Game.AUTOMOBILISTA_2;
  if (game === SgpGame.F1_23) return Game.F1_23;
}

function sgpCategory2Category(cat: SgpCategory | undefined): Category | undefined {
  if (!cat) return;
  return cat[0].toUpperCase() as Category;
}
