import { useMemo, useState } from 'react';

import { Filter } from 'components/data-provider/filter-data';
import { useRawData } from 'components/data-provider';
import { Game } from 'data/types';

export function useCalculatorPage() {
  const rawData = useRawData();
  const [filter, setFilter] = useState<Filter>(() => {
    const accVersions = rawData.getAccVersions();
    return { game: Game.ACC, accVersion: accVersions[accVersions.length - 1] };
  });

  const tracks = useMemo(() => {
    const tracks = rawData.raw.tracks.filter(({ game, best, version }) => {
      // remove tracks without time data
      if (!best.quali && !best.race) return false;
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

  return {
    filter,
    tracks,
    isAccSelected: filter?.game === Game.ACC,
    setFilter,
  };
}
