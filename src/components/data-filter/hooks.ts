import { useState, useCallback, useEffect } from 'react';
import { Filter } from 'utils/filter-data';
import { Props } from '.';

export function useDataFilter({ onChange, defaultValue }: Props) {
  const [filter, setFilter] = useState<Filter>({
    championships: 'seasons',
    ...defaultValue,
  });

  useEffect(() => onChange(filter), [filter]);

  const updateChampionships = useCallback(
    (value: Filter['championships']) =>
      setFilter((filter) => ({
        ...filter,
        championships: value,
      })),
    []
  );

  return { filter, updateChampionships };
}
