import { FC } from 'react';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { Filter } from 'utils/filter-data';
import { useDataFilter } from './hooks';

export interface Props {
  onChange: (filter: Filter) => void;
  defaultValue?: Partial<Filter>;
}

export const DataFilter: FC<Props> = (props) => {
  const { filter, updateChampionships } = useDataFilter(props);

  return (
    <RadioGroup onChange={updateChampionships} defaultValue={filter.championships} my={4}>
      <Radio value='all' mx={4}>
        Show all championships
      </Radio>
      <Radio value='seasons' mx={4}>
        Show seasons only
      </Radio>
    </RadioGroup>
  );
};
