import { useCallback, useMemo, useState } from 'react';

import { Filter } from 'utils/filter-data';
import { useData } from 'components/data-provider';
import { Driver, Game } from 'data/types';

const DEFAULT_FILTER: Filter = {
  game: Game.ACC,
};

export function useTracksPage() {
  const rawData = useData();
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);

  const tracks = useMemo(() => {
    if (!rawData) return;
    const tracks = rawData.tracks.filter(({ game, best, version }) => {
      // remove tracks without time data
      if (!best.quali.length && !best.race.length) return false;
      // apply the filter
      if (!filter || !filter.game) return true;
      if (game !== filter.game) return false;
      if (game === Game.ACC && filter.accVersion && filter.accVersion !== version) {
        return false;
      }
      return true;
    });
    tracks.sort((a, b) => a.name.localeCompare(b.name));
    return tracks;
  }, [rawData, filter]);

  const getDriverName = useCallback(
    (driverId: Driver['id']): string | undefined => {
      return rawData?.drivers.find((driver) => driver.id === driverId)?.name;
    },
    [rawData]
  );

  const getCarName = useCallback(
    (driverId: Driver['id']): string | undefined => {
      return rawData?.cars.find((car) => car.id === driverId)?.name;
    },
    [rawData]
  );

  return {
    filter,
    tracks,
    isAccSelected: filter?.game === Game.ACC,
    setFilter,
    getDriverName,
    getCarName,
  };
}
