import {
  AccVersion,
  Car,
  Championship,
  Driver,
  Event,
  Game,
  ProcessedData,
  TrackData,
} from 'data/types';
import { isEventFromAccVersion } from './acc-version';

export interface Filter {
  onlyChampionships?: boolean;
  seasonCustomName?: string;
  game?: Game;
  accVersion?: AccVersion;
}

export function filterData(
  data: ProcessedData | undefined,
  filter?: Filter
): ProcessedData | undefined {
  if (!data) return;
  if (!filter) return data;

  const eventFilter = getEventFilter(filter);

  const championships = data.championships
    .filter(getChampionshipFilter(filter))
    .map((c) => {
      const events = c.events.filter(eventFilter);
      return {
        ...c,
        events,
      };
    });

  const res: ProcessedData = {
    processedOn: data.processedOn,
    championships,
    drivers: data.drivers.filter(getDriversFilter(filter, championships)),
    cars: data.cars.filter(getCarsFilter(filter, championships)),
    tracks: data.tracks.filter(getTracksFilter(filter, championships)),
  };
  return res;
}

function getChampionshipFilter(filter: Filter): (championship: Championship) => boolean {
  return (c) => {
    if (filter.game) {
      if (c.game !== filter.game) {
        return false;
      }
    }

    if (filter.onlyChampionships && !/^S\d+$/.test(c.customName!)) {
      return false;
    }

    if (filter.seasonCustomName && filter.seasonCustomName !== c.customName) {
      return false;
    }

    return true;
  };
}

function getEventFilter(filter: Filter): (event: Event) => boolean {
  return (e) => {
    if (/practice/i.test(e.name)) return false;
    if (filter.game === Game.ACC && !isEventFromAccVersion(e, filter.accVersion)) {
      return false;
    }
    return true;
  };
}

function getDriversFilter(
  filter: Filter,
  championships: Championship[]
): (driver: Driver) => boolean {
  return (driver) =>
    championships.some(({ events }) =>
      events.some((event) => event.activeDrivers.includes(driver.id))
    );
}

function getCarsFilter(
  filter: Filter,
  championships: Championship[]
): (car: Car) => boolean {
  return (c) => true;
}

function getTracksFilter(
  filter: Filter,
  championships: Championship[]
): (track: TrackData) => boolean {
  return (track) =>
    championships.some(({ events }) =>
      events.some(
        (event) =>
          event.trackId === track.id &&
          (track.game !== Game.ACC || isEventFromAccVersion(event, track.version))
      )
    );
}
