import { FC, ReactNode } from 'react';
import { Tr, Th, Td, Table, Thead, Tbody } from '@chakra-ui/react';

import { getPctgColor } from 'utils/get-pctg-color';
import { msToTime } from 'utils/time';

export interface Props {
  max: number;
  quali?: number;
  race?: number;
}

export const Percentages: FC<Props> = ({ max, quali, race }) => {
  const rows: ReactNode[] = [];
  for (let p = 100; p <= max; p++) {
    const color = getPctgColor(p);

    rows.push(
      <Tr key={p} borderLeft={`3px solid ${color}`}>
        <Th>{`${p}%`}</Th>
        <Td>{quali && msToTime((quali * p) / 100)}</Td>
        <Td>{race && msToTime((race * p) / 100)}</Td>
      </Tr>
    );
  }

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
          <Th></Th>
          {quali && <Th>Quali</Th>}
          {race && <Th>Race</Th>}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
