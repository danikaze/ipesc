import { useCallback, useMemo, useState } from 'react';

import { Filter } from 'utils/filter-data';
import { useData } from 'components/data-provider';
import { AccVersion, Driver, Game } from 'data/types';

export function useTracksPage() {
  const rawData = useData();
  const [filter, setFilter] = useState<Filter>();

  const tracks = useMemo(() => {
    if (!rawData) return;
    const tracks = rawData.tracks.filter(({ id, game, best }) => {
      // remove tracks without time data
      if (!best.quali.length && !best.race.length) return false;
      // apply the filter
      if (!filter || !filter.game) return true;
      if (game !== filter.game) return false;
      if (game === Game.ACC && filter.accVersion) {
        if (filter.accVersion === AccVersion.V_2019 && !/_2019$/.test(id)) return false;
        if (filter.accVersion === AccVersion.V_2020 && !/_2020$/.test(id)) return false;
        if (filter.accVersion === AccVersion.V_2023 && /_20\d\d$/.test(id)) return false;
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
    tracks,
    isAccSelected: filter?.game === Game.ACC,
    setFilter,
    getDriverName,
    getCarName,
  };
}
