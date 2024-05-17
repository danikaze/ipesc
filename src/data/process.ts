import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { sync as mkdirpSync } from 'mkdirp';

import { SgpChampionshipApiData } from 'utils/sgp/championship-api-data';
import { SgpEventType } from 'utils/sgp/types';
import { SgpEventApiData } from 'utils/sgp/event-api-data';
import { dropUndefinedFields } from 'utils/drop-undefined-fields';
import { Timestamp } from 'utils/types';

import { sgpGame2Game, sgpCategory2Category, sgpEventType2EventType } from './sgp';
import { CUSTOM_NAMES, OUTPUT_FILE, RAW_DATA_DIR, ROOT_PATH } from './constants';
import {
  Car,
  Championship,
  Driver,
  Event,
  ProcessedData,
  TrackRecord,
  TrackData,
  EventType,
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
  const dataToWrite = dropUndefinedFields(processedData);
  writeProcessedData(dataToWrite);

  console.log('');
}

function relativePath(path: string): string {
  return relative(ROOT_PATH, path).replace(/\\/g, '/');
}

function formatSize(bytes: number): string {
  const n = Math.round(bytes / 1024)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${n} kb`;
}

function readRawFiles(): SgpChampionshipApiData[] {
  const data = readdirSync(RAW_DATA_DIR)
    .map((file) => {
      const path = join(RAW_DATA_DIR, file);
      try {
        const json = readFileSync(path).toString();
        const raw = JSON.parse(json);
        const apiData = SgpChampionshipApiData.fromJson(raw);
        console.log(`  - Read ${relativePath(path)} (${formatSize(json.length)})`);
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
    console.log(
      `Processed data into ${relativePath(OUTPUT_FILE)} (${formatSize(str.length)})`
    );
  } catch (e) {
    console.error(`Error writing ${relativePath(OUTPUT_FILE)}:`, e);
  }
}

function processRawData(rawData: SgpChampionshipApiData[]): ProcessedData {
  const processedData: Omit<ProcessedData, 'updatedOn'> = {
    processedOn: Date.now(),
    drivers: getAllDrivers(rawData),
    cars: getAllCars(rawData),
    championships: getChampionships(rawData),
    tracks: getTrackData(rawData),
  };

  return {
    updatedOn: getUpdatedTime(processedData.championships),
    ...processedData,
  };
}

function getUpdatedTime(
  championships: ProcessedData['championships']
): ProcessedData['updatedOn'] {
  return Math.max(
    ...championships.flatMap((championship) =>
      championship.events
        .filter((event) => event.results.length)
        .flatMap((event) => event.startTime || 0)
    )
  );
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
        raceNumber: driver.raceNumber,
        category: sgpCategory2Category(driver.category),
      };

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
    inactiveDrivers: event.getDrivers('inactive').map((driver) => driver.id),
    results: getEventResults(event),
  }));
}

function getEventResults(event: SgpEventApiData): Event['results'] {
  const includedEventTypes: EventType[] = ['quali', 'race'];
  return event
    .getAllResults()
    .filter(({ type }) => includedEventTypes.includes(sgpEventType2EventType(type)!))
    .map((results) => {
      const type = sgpEventType2EventType(results.type)!;
      const p1time = results.results[0].totalTime;
      return {
        type,
        wet: results.wetTrack ? true : undefined,
        results: results.results.map((result) => {
          const retired =
            type === 'race' && result.totalTime > 0 && result.totalTime < p1time;
          return {
            driverId: result.driverId,
            carId: result.carModelId,
            position: result.position,
            retired: retired ? true : undefined,
            // do not include formation/start laps as the best lap
            averageLapTime: result.bestCleanLap > 0 ? result.averageLapTime : undefined,
            bestCleanLapTime:
              result.bestCleanLap > 0 ? result.bestCleanLapTime : undefined,
            avgCleanLapTime:
              result.bestCleanLap > 0 ? result.averageCleanLapTime : undefined,
          };
        }),
      };
    });
}

function getTrackData(rawData: SgpChampionshipApiData[]): TrackData[] {
  const res: Map<string, TrackData> = new Map();

  rawData.forEach((championship) => {
    championship.getEvents().forEach((ev) => {
      const key = `${ev.getTrackId()}:${ev.getAccVersion()}`;
      const data: TrackData = res.get(key) || {
        id: ev.getTrackId(),
        name: ev.getTrackName(),
        game: sgpGame2Game(ev.getGame()),
        version: ev.getAccVersion(),
        best: {},
      };

      data.best.quali = getBestEventResultOfType(ev, SgpEventType.QUALI, data.best.quali);
      data.best.race = getBestEventResultOfType(ev, SgpEventType.RACE, data.best.race);

      res.set(key, data);
    });
  });

  return Array.from(res.values());
}

function getBestEventResultOfType(
  ev: SgpEventApiData,
  type: SgpEventType,
  currentResult: TrackRecord | undefined
): TrackRecord | undefined {
  let trackRecord = currentResult;
  const eventDate = new Date(ev.getStartDate()).getTime();

  for (let i = 0; ; i++) {
    try {
      const eventResults = ev.getResults(type, i);
      if (!eventResults) break;
      const bestResult = eventResult2trackRecord(eventResults, eventDate);
      if (bestResult && (!trackRecord || trackRecord.lapTime > bestResult.lapTime)) {
        trackRecord = bestResult;
        if (eventResults.wetTrack) {
          trackRecord.wet = true;
        }
      }
    } catch (e) {
      break;
    }
  }

  return trackRecord;
}

function eventResult2trackRecord(
  results: Exclude<ReturnType<SgpEventApiData['getResults']>, undefined>,
  eventDate: Timestamp
): TrackRecord | undefined {
  let record: TrackRecord | undefined;

  results.results.forEach((result) => {
    const lapTime = result.bestCleanLapTime;
    if (!lapTime || (record?.lapTime && record.lapTime < lapTime)) return;
    record = {
      lapTime,
      date: eventDate,
      driverId: result.driverId,
      carId: result.carModelId,
    };
    if (results.wetTrack) {
      record.wet = true;
    }
  });

  return record;
}
