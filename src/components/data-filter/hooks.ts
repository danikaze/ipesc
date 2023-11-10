import { useState, useCallback, useEffect, ChangeEvent } from 'react';

import { Filter } from 'utils/filter-data';

import { Props } from '.';

export function useDataFilter({ onChange, defaultValue }: Props) {
  const [filter, setFilter] = useState<Filter>({
    onlyChampionships: true,
    ...defaultValue,
  });

  useEffect(() => onChange(filter), [filter]);

  const updateChampionships = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setFilter((filter) => ({
        ...filter,
        onlyChampionships: ev.target.value === 'anySeason',
        seasonCustomName:
          ev.target.value !== 'anySeason' && ev.target.value !== 'all'
            ? ev.target.value
            : undefined,
      })),
    []
  );

  const updateGame = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setFilter((filter) => ({
        ...filter,
        game: ev.target.value as Filter['game'],
      })),
    []
  );

  const updateAccVersion = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      setFilter((filter) => ({
        ...filter,
        accVersion: ev.target.value as Filter['accVersion'],
      })),
    []
  );

  return { filter, updateChampionships, updateGame, updateAccVersion };
}
