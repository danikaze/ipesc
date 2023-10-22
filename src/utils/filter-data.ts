import { Championship, ProcessedData } from 'data/types';

export interface Filter {
  championships: 'all' | 'seasons';
}

export function filterData(
  data: ProcessedData | undefined,
  filter?: Filter
): ProcessedData | undefined {
  if (!data) return;
  if (!filter) return data;

  const res = { ...data };
  if (filter.championships === 'seasons') {
    res.championships = data.championships.filter(isSeasonChampionship).map((c) => ({
      ...c,
      events: c.events.filter((e) => !/practice/.test(e.name)),
    }));
  }

  return res;
}

function isSeasonChampionship(championship: Championship): boolean {
  return /^S\d+$/.test(championship.customName!);
}
