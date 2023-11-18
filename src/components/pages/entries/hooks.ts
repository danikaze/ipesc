import { useState } from 'react';
import { Filter } from 'components/data-provider/filter-data';

export function useEntriesPage() {
  const [seasonFilter, setSeasonFilter] = useState<Filter>({ onlyFinishedEvents: true });
  const [raceFilter, setRaceFilter] = useState<Filter>({ onlyFinishedEvents: true });

  return {
    seasonFilter,
    raceFilter,
    setSeasonFilter,
    setRaceFilter,
  };
}
