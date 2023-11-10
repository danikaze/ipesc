import { FC } from 'react';
import { Flex, Select } from '@chakra-ui/react';

import { Filter } from 'utils/filter-data';
import { AccVersion, Game } from 'data/types';

import { useDataFilter } from './hooks';

export interface Props {
  onChange: (filter: Filter) => void;
  defaultValue?: Partial<Filter>;
  showChampionships?: boolean;
  championshipList?: string[];
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
      {props.showChampionships && renderChampionships(hookData, props.championshipList)}
    </Flex>
  );
};

function renderChampionships(
  { filter, updateChampionships }: HookData,
  championshipList: string[] | undefined
) {
  const defaultValue = filter.onlyChampionships ? 'anySeason' : 'all';
  const optionList = [
    <option key='all' value='all'>
      Include every championships
    </option>,
  ];

  if (!filter.game || filter.game === Game.ACC) {
    optionList.push(
      <option key='anySeason' value='anySeason'>
        Include official seasons
      </option>
    );
  }

  (championshipList || [])?.forEach((seasonName, i) =>
    optionList.push(
      <option key={seasonName} value={seasonName}>
        {seasonName}
      </option>
    )
  );

  if (optionList.length <= 1) return null;

  return (
    <Select onChange={updateChampionships} defaultValue={defaultValue}>
      {optionList}
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
      <option value={''}>Any version</option>
      <option value={AccVersion.V_16}>v1.6 (2020)</option>
      <option value={AccVersion.V_18}>v1.8 (2021)</option>
      <option value={AccVersion.V_19}>v1.9 (2023)</option>
    </Select>
  );
}
