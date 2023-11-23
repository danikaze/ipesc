import { FC } from 'react';
import { Table, Tbody, Tr, Th, Td, Thead } from '@chakra-ui/react';

import { Category } from 'data/types';
import { msToTime } from 'utils/time';

import { CategoryBadge } from './category-badge';
import { CategoryBests } from '.';

export type Props = CategoryBests;

export const CategoryTimes: FC<Props> = ({ quali, race }) => {
  return (
    <Table
      size='sm'
      height='min-content'
      backgroundColor='#f1f1f1'
      borderRadius={5}
      mb={4}
    >
      <Thead>
        <Tr>
          <Th width={50}></Th>
          {quali && (
            <Th textAlign='center' pr={race ? 0 : undefined}>
              Quali
            </Th>
          )}
          {race && <Th textAlign='center'>Race</Th>}
        </Tr>
      </Thead>
      <Tbody>
        <CategoryRow category={Category.PRO} quali={quali} race={race} />
        <CategoryRow category={Category.SILVER} quali={quali} race={race} />
        <CategoryRow category={Category.AM} quali={quali} race={race} />
      </Tbody>
    </Table>
  );
};

interface CategoryRowProps extends CategoryBests {
  category: Category;
}

const CategoryRow: FC<CategoryRowProps> = ({ category, quali, race }) => (
  <Tr>
    <Th width={50} pr={0}>
      <CategoryBadge category={category} />
    </Th>
    {quali && <Td pr={race ? 0 : undefined}>{msToTime(quali[category])}</Td>}
    {race && <Td>{msToTime(race[category])}</Td>}
  </Tr>
);
