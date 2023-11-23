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
      width='min-content'
      height='min-content'
      backgroundColor='#f1f1f1'
      borderRadius={5}
      mb={4}
    >
      <Thead>
        <Tr>
          <Th width={50}></Th>
          {quali && <Th>Quali</Th>}
          {race && <Th>Race</Th>}
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
    <Th width={50}>
      <CategoryBadge category={category} />
    </Th>
    {quali && <Td>{msToTime(quali[category])}</Td>}
    {race && <Td>{msToTime(race[category])}</Td>}
  </Tr>
);
