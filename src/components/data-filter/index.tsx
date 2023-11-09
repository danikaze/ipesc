import { FC } from 'react';
import { Flex, Select } from '@chakra-ui/react';

import { Filter } from 'utils/filter-data';
import { Game } from 'data/types';

import { useDataFilter } from './hooks';

export interface Props {
  onChange: (filter: Filter) => void;
  defaultValue?: Partial<Filter>;
  showChampionships?: boolean;
  showGame?: boolean;
  showAccVersion?: boolean;
}

type HookData = ReturnType<typeof useDataFilter>;

export const DataFilter: FC<Props> = (props) => {
  const hookData = useDataFilter(props);

  return (
    <Flex>
      {props.showGame && renderGame(hookData)}
      {props.showAccVersion && renderAccVersion(hookData)}
      {props.showChampionships && renderChampionships(hookData)}
    </Flex>
  );
};

function renderChampionships({ filter, updateChampionships }: HookData) {
  if (filter.game !== Game.ACC) return null;

  return (
    <Select onChange={updateChampionships} defaultValue={filter.championships}>
      <option value='all'>Show all championships</option>
      <option value='seasons'>Show seasons only</option>
    </Select>
  );
}

function renderGame({ filter, updateGame }: HookData) {
  return (
    <Select onChange={updateGame} defaultValue={filter.game}>
      <option value={Game.ACC}>Assetto Corsa Competizione</option>
      <option value={Game.AC}>Assetto Corsa</option>
    </Select>
  );
}

function renderAccVersion({ filter, updateAccVersion }: HookData) {
  return (
    <Select onChange={updateAccVersion} defaultValue={filter.accVersion}>
      <option value='2019'>v1.6 (2019)</option>
      <option value='2020'>v1.8 (2020)</option>
      <option value='2023'>v1.9 (2023)</option>
    </Select>
  );
}
