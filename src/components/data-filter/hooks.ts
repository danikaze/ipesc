import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { Filter } from 'utils/filter-data';
import { Props } from '.';
import { AccVersion } from 'data/types';

export function useDataFilter({ onChange, defaultValue }: Props) {
  const [filter, setFilter] = useState<Filter>({
    championships: 'seasons',
    accVersion: AccVersion.V_2023,
    ...defaultValue,
  });

  useEffect(() => onChange(filter), [filter]);

  const updateChampionships = useCallback(
    (value: string) =>
      setFilter((filter) => ({
        ...filter,
        championships: value as Filter['championships'],
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
