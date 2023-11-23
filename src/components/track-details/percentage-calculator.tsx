import { FC, useState, useCallback, KeyboardEventHandler } from 'react';
import { Box, Heading, Input, Table, Tbody, Tr, Th, Td, Flex } from '@chakra-ui/react';

import { Category } from 'data/types';
import { formatRatioAsPctg } from 'utils/format-data';
import { getPctgColor } from 'utils/get-color';
import { timeToMs } from 'utils/time';
import { CategoryBests } from '.';
import { CategoryBadge } from './category-badge';

export type Props = CategoryBests;

export const PercentageCalculator: FC<Props> = ({ quali, race }) => {
  const [lapTime, setLapTime] = useState<number | undefined>(undefined);

  const handler = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (ev) => {
      const target = ev.target as HTMLInputElement;
      target.value = target.value.replace(/[^\d:.]/g, '');
      setLapTime(timeToMs(target.value));
    },
    [quali, race]
  );

  return (
    <Box>
      <Heading size='xs' mb={1}>
        What's my percentage?
      </Heading>
      <Input
        size='sm'
        borderBottomRadius={0}
        onKeyUp={handler}
        placeholder='Laptime as 1:23.456'
      />
      <Table size='sm' backgroundColor='#f1f1f1' borderRadius={5} borderTopRadius={0}>
        <Tbody>
          <ResultRow title='QUALI' categoryTimes={quali} lapTime={lapTime} />
          <ResultRow title='RACE' categoryTimes={race} lapTime={lapTime} />
        </Tbody>
      </Table>
    </Box>
  );
};

interface ResultRowProps {
  title: string;
  categoryTimes: Record<Category, number> | undefined;
  lapTime: number | undefined;
}

const ResultRow: FC<ResultRowProps> = ({ title, lapTime, categoryTimes }) => {
  const pctg = categoryTimes && lapTime && lapTime / categoryTimes[Category.PRO];
  const color = pctg ? getPctgColor(100 * pctg) : 'transparent';

  return (
    <Tr borderLeft={`3px solid ${color}`}>
      <Th>{title}</Th>
      <Td>{renderResult(lapTime, pctg, categoryTimes)}</Td>
    </Tr>
  );
};

function renderResult(
  lapTime: number | undefined,
  pctg: number | undefined,
  categoryTimes: Record<Category, number> | undefined
) {
  const formattedPctg = pctg && formatRatioAsPctg(pctg);
  let categoryBadge;

  if (lapTime && categoryTimes) {
    if (lapTime < categoryTimes[Category.SILVER]) {
      categoryBadge = <CategoryBadge ml={4} category={Category.PRO} />;
    } else if (lapTime < categoryTimes[Category.AM]) {
      categoryBadge = <CategoryBadge ml={4} category={Category.SILVER} />;
    } else {
      categoryBadge = <CategoryBadge ml={4} category={Category.AM} />;
    }
  }

  return (
    <Flex alignItems='center'>
      {formattedPctg}
      {categoryBadge}
    </Flex>
  );
}
