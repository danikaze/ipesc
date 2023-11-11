import { useCallback, useEffect, ChangeEvent, useState } from 'react';

import { Filter } from 'components/data-provider/filter-data';

import { Props } from '.';

export function useDataFilter({ onChange, value }: Props) {
  const [filter, setFilter] = useState<Filter>(value || {});
  const triggerChange = useCallback(
    (changes: Partial<Filter>, fromValue?: boolean) => {
      setFilter((previous) => {
        if (fromValue) {
          return changes;
        }
        const newFilter = {
          ...previous,
          ...changes,
        };
        onChange(newFilter);
        return newFilter;
      });
    },
    [onChange]
  );

  useEffect(() => {
    if (!value) return;
    triggerChange(value, true);
  }, [value]);

  const updateChampionships = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      triggerChange({
        onlyChampionships: ev.target.value === 'anySeason',
        seasonCustomName:
          ev.target.value !== 'anySeason' && ev.target.value !== 'all'
            ? ev.target.value
            : undefined,
      }),
    []
  );

  const updateGame = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      triggerChange({
        game: ev.target.value as Filter['game'],
      }),
    []
  );

  const updateAccVersion = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) =>
      triggerChange({
        accVersion: ev.target.value as Filter['accVersion'],
      }),
    []
  );

  return {
    filter,
    updateChampionships,
    updateGame,
    updateAccVersion,
  };
}
