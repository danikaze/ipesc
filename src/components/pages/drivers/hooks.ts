import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { Game } from 'data/types';
import { Filter, filterData } from 'components/data-provider/filter-data';
import { isEventFromAccVersion } from 'utils/acc-version';
import { useRawData } from 'components/data-provider';
import { Props as ChartProps } from 'components/charts/drivers-rank-chart';

const DEFAULT_FILTER: Filter = {
  onlyChampionships: false,
  game: Game.ACC,
};

export function useDriversPage() {
  const rawData = useRawData();
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const [chartOptions, setChartOptions] = useState<ChartProps>({
    lapField: 'bestCleanLapTime',
    minEvents: undefined,
    maxPctg: undefined,
  });
  const namedSeasons = useMemo(
    () =>
      rawData?.raw.championships
        // only championships with custom names
        .filter((c) => c.customName)
        // if game is selected, only championships from that game
        .filter((c) => !filter?.game || filter?.game === c.game)
        // if ACC is selected AND version too, consider it too
        .filter(
          (c) =>
            !filter?.accVersion ||
            filter?.game !== Game.ACC ||
            c.events.some((e) => isEventFromAccVersion(e, filter!.accVersion!))
        )
        .map((c) => c.customName as string),
    [rawData, filter]
  );

  const updateFilter = useCallback(
    (newFilter: Filter) =>
      setFilter((oldFilter) => {
        if (oldFilter) {
          if (oldFilter.game !== newFilter.game) {
            newFilter = { ...DEFAULT_FILTER, game: newFilter.game };
          }
          if (oldFilter.accVersion !== newFilter.accVersion) {
            newFilter.onlyChampionships = DEFAULT_FILTER.onlyChampionships;
          }
        }
        return newFilter;
      }),
    []
  );

  const updateLapFields = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setChartOptions((state) => ({
        ...state,
        lapField: (ev.target.value || undefined) as ChartProps['lapField'],
      })),
    []
  );

  const updateMinEvents = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setChartOptions((state) => ({
        ...state,
        minEvents: Number(ev.target.value) || undefined,
      })),
    []
  );

  const updateMaxPctg = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setChartOptions((state) => ({
        ...state,
        maxPctg: Number(ev.target.value) || undefined,
      })),
    []
  );

  return {
    filter,
    updateFilter,
    chartOptions,
    updateLapFields,
    updateMinEvents,
    updateMaxPctg,
    filteredData: useMemo(() => filterData(rawData, filter), [rawData, filter]),
    isAccSelected: filter?.game === Game.ACC,
    namedSeasons,
  };
}
