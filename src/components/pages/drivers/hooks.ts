import { useMemo, useState } from 'react';

import { Filter, filterData } from 'utils/filter-data';
import { useData } from 'components/data-provider';
import { Game } from 'data/types';

export function useDriversPage() {
  const rawData = useData();
  const [filter, setFilter] = useState<Filter>();

  return {
    filteredData: useMemo(() => filterData(rawData, filter), [rawData, filter]),
    isAccSelected: filter?.game === Game.ACC,
    filterChangeTime: useMemo(() => Date.now(), [filter]),
    setFilter,
  };
}
