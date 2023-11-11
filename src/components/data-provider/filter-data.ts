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
import { DataQuery } from 'data/data-query';
import { isEventFromAccVersion } from '../../utils/acc-version';

export interface Filter {
  onlyChampionships?: boolean;
  seasonCustomName?: string;
  game?: Game;
  accVersion?: AccVersion;
}

export function filterData(query: DataQuery, filter?: Filter): DataQuery | undefined {
  if (!query) return;
  if (!filter) return query;

  const eventFilter = getEventFilter(filter);

  const { raw } = query;
  const championships = raw.championships
    .filter(getChampionshipFilter(filter))
    .map((c) => {
      const events = c.events.filter(eventFilter);
      return {
        ...c,
        events,
      };
    });

  const filteredData: ProcessedData = {
    processedOn: raw.processedOn,
    championships,
    drivers: raw.drivers.filter(getDriversFilter(query, filter, championships)),
    cars: raw.cars.filter(getCarsFilter(filter, championships)),
    tracks: raw.tracks.filter(getTracksFilter(filter, championships)),
  };
  return new DataQuery(filteredData);
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
  query: DataQuery,
  filter: Filter,
  championships: Championship[]
): (driver: Driver) => boolean {
  return (driver) =>
    championships.some(({ events }) =>
      events.some((event) => query.getDriverList(event).active.includes(driver.id))
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
