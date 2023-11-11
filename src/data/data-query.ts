import {
  Car,
  Championship,
  Driver,
  Event,
  EventType,
  ProcessedData,
  TrackData,
  TrackRecord,
} from 'data/types';
import { Filter, filterData } from 'components/data-provider/filter-data';
import { LapTimeAsMs } from 'utils/types';
import { getAccVersionFromTime } from 'utils/acc-version';

/**
 * Provide access to the raw ProcessedData
 * and methods to access the data derived from the raw object
 */
export class DataQuery {
  public readonly raw: Readonly<ProcessedData>;

  constructor(data: ProcessedData) {
    this.raw = data;
  }

  /**
   * Return a new instance of DataQuery based on the result after
   * filtering the current data
   */
  public filter(filter: Filter | undefined): DataQuery {
    return filterData(this, filter)!;
  }

  /**
   * Get a list of defined championship custom names
   */
  public getChampionshipCustomNames(): string[] {
    return this.raw.championships
      .map((championship) => championship.customName)
      .filter(Boolean) as string[];
  }

  /**
   * Get the Driver name based on its id
   */
  public getDriverName(driverId: Driver['id']): string | undefined {
    const driver = this.raw.drivers.find((driver) => driver.id === driverId);
    return driver ? driver.name : undefined;
  }

  /**
   * Get the Car name based on its id
   */
  public getCarName(carId: Car['id']): string | undefined {
    const car = this.raw.cars.find((car) => car.id === carId);
    return car ? car.name : undefined;
  }

  /**
   * Get the best times of a driver in a given track
   */
  public getDriverTrackRecord(
    driverId: Driver['id'],
    trackId: TrackData['id']
  ): Partial<Record<EventType, TrackRecord>> {
    let record: Partial<Record<EventType, TrackRecord>> = {};

    this.raw.championships.forEach((championship) =>
      championship.events.forEach((event) => {
        if (event.trackId !== trackId) return;
        event.results.forEach(({ type, results }) => {
          const driverResult = results.find((result) => result.driverId === driverId);
          if (!driverResult) return;
          const typeRecord = record[type];
          if (
            driverResult.bestCleanLapTime &&
            (!typeRecord || typeRecord.lapTime > driverResult.bestCleanLapTime)
          ) {
            record[type] = {
              ...driverResult,
              lapTime: driverResult.bestCleanLapTime,
              date: event.startTime,
            };
          }
        });
      })
    );

    return record;
  }

  /**
   * Get the list of active and inactive drivers for one event
   */
  public getDriverList(event: Event): Record<'active' | 'inactive', string[]> {
    const allDriverIds = event.results.flatMap(({ results }) =>
      results.map(({ driverId }) => driverId)
    );
    return {
      active: allDriverIds.filter(
        (driverId) => !event.inactiveDrivers.includes(driverId)
      ),
      inactive: event.inactiveDrivers,
    };
  }

  /**
   * Check if the specified driver has raced in a given championship
   */
  public hasDriverRacedInChampionship(
    driverId: Driver['id'],
    championshipId: Championship['id']
  ): boolean {
    const championship = this.raw.championships.find(({ id }) => id === championshipId);
    if (!championship) return false;

    return championship.events.some((event) =>
      this.getDriverList(event).active.includes(driverId)
    );
  }

  /**
   * Get all times per driver for a track sorted by fastest
   */
  public getTrackRecords(track: TrackData): Partial<Record<EventType, TrackRecord[]>> {
    // fastest records per driver
    const quali: Map<Driver['id'], TrackRecord> = new Map();
    const race: Map<Driver['id'], TrackRecord> = new Map();

    // analize every event result done in the given track
    this.raw.championships.forEach(({ events, game }) =>
      events
        .filter(
          (event) =>
            event.trackId === track.id &&
            game === track.game &&
            getAccVersionFromTime(event.startTime) === track.version
        )
        .forEach((event) => {
          event.results.forEach(({ type, results }) =>
            results.forEach((result) => {
              if (!result.bestCleanLapTime) return;
              const map = type === 'quali' ? quali : race;
              const driverBest = map.get(result.driverId);
              if (!driverBest || driverBest.lapTime > result.bestCleanLapTime) {
                map.set(result.driverId, {
                  lapTime: result.bestCleanLapTime,
                  driverId: result.driverId,
                  carId: result.carId,
                  date: event.startTime,
                });
              }
            })
          );
        })
    );

    const res = {
      quali: Array.from(quali.values()),
      race: Array.from(race.values()),
    };

    res.quali.sort(DataQuery.trackRecordSorter);
    res.race.sort(DataQuery.trackRecordSorter);

    return res;
  }

  /**
   * Query for track data
   */
  public getTrackData(
    track: Pick<TrackData, 'id' | 'game' | 'version'>
  ): TrackData | undefined {
    return this.raw.tracks.find(
      ({ id, game, version }) =>
        id === track.id && game === track.game && version === track.version
    );
  }

  /**
   * Given a track, get the percentage (as a ratio)
   * of the fastest time for a given event type
   */
  public getTrackPctg(
    track: Pick<TrackData, 'id' | 'game' | 'version'>,
    type: EventType,
    time: LapTimeAsMs
  ): number | undefined {
    const bestTime = this.getTrackData(track)?.best?.[type]?.lapTime;
    return bestTime ? time / bestTime : undefined;
  }

  /**
   * Comparator function for TrackRecord arrays
   */
  private static trackRecordSorter(a: TrackRecord, b: TrackRecord) {
    return a.lapTime - b.lapTime;
  }
}
