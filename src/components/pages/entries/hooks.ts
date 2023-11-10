import { useMemo, useState } from 'react';
import { useData } from 'components/data-provider';
import { Filter, filterData } from 'utils/filter-data';

export function useEntriesPage() {
  const data = useData();
  const [seasonFilter, setSeasonFilter] = useState<Filter>({});
  const [raceFilter, setRaceFilter] = useState<Filter>({});

  return {
    seasonFilter,
    raceFilter,
    seasonData: useMemo(() => filterData(data, seasonFilter), [data, seasonFilter]),
    raceData: useMemo(() => filterData(data, raceFilter), [data, raceFilter]),
    setSeasonFilter,
    setRaceFilter,
  };
}
