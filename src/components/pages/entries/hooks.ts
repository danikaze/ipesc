import { useState } from 'react';
import { Filter } from 'components/data-provider/filter-data';

export function useEntriesPage() {
  const [seasonFilter, setSeasonFilter] = useState<Filter>({});
  const [raceFilter, setRaceFilter] = useState<Filter>({});

  return {
    seasonFilter,
    raceFilter,
    setSeasonFilter,
    setRaceFilter,
  };
}
