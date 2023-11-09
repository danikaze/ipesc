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

export interface Filter {
  championships?: 'all' | 'seasons';
  game?: Game;
  accVersion?: AccVersion;
}

export function filterData(
  data: ProcessedData | undefined,
  filter?: Filter
): ProcessedData | undefined {
  if (!data) return;
  if (!filter) return data;

  const eFilter = getEventFilter(filter);

  const championships = data.championships
    .filter(getChampionshipFilter(filter))
    .map((c) => {
      const events = c.events.filter(eFilter);
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
    if (
      (filter.championships === 'seasons' && !filter.game) ||
      filter.game === Game.ACC
    ) {
      if (!/^S\d+$/.test(c.customName!)) return false;
    }
    if (filter.game) {
      if (c.game !== filter.game) {
        return false;
      }
    }
    return true;
  };
}

function getEventFilter(filter: Filter): (event: Event) => boolean {
  return (e) => {
    if (/practice/i.test(e.name)) return false;
    if (filter.game === Game.ACC) {
      if (filter.accVersion === AccVersion.V_2019 && !/_2019$/.test(e.trackId)) {
        return false;
      }
      if (filter.accVersion === AccVersion.V_2020 && !/_2020$/.test(e.trackId)) {
        return false;
      }
      if (filter.accVersion === AccVersion.V_2023 && /_20\d\d$/.test(e.trackId)) {
        return false;
      }
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
      events.some((event) => event.trackId === track.id)
    );
}
