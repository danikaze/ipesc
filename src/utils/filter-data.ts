import { AccVersion, Championship, Event, Game, ProcessedData } from 'data/types';

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

  const res = { ...data };
  const cFilter = getChampionshipFilter(filter);
  const eFilter = getEventFilter(filter);
  res.championships = res.championships.filter(cFilter).map((c) => ({
    ...c,
    events: c.events.filter(eFilter),
  }));

  return res;
}

function getChampionshipFilter(filter: Filter): (championship: Championship) => boolean {
  return (c) => {
    if (filter.championships === 'seasons') {
      if (!/^S\d+$/.test(c.customName!)) return false;
    }
    if (filter.game && c.game !== filter.game) {
      return false;
    }
    return true;
  };
}

function getEventFilter(filter: Filter): (event: Event) => boolean {
  return (e) => {
    if (/practice/i.test(e.name)) return false;
    return true;
  };
}
