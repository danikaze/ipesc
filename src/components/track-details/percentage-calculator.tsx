import { FC, useState, useCallback, KeyboardEventHandler } from 'react';
import { Box, Heading, Input, Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import { formatRatioAsPctg } from 'utils/format-data';
import { getPctgColor } from 'utils/get-pctg-color';
import { timeToMs } from 'utils/time';

export interface Props {
  quali?: number;
  race?: number;
}

export const PercentageCalculator: FC<Props> = ({ quali, race }) => {
  const [[qualiPctg, racePctg], setPctgs] = useState<
    [qualiPctg: number | undefined, racePctg: number | undefined]
  >([undefined, undefined]);

  const handler = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (ev) => {
      const target = ev.target as HTMLInputElement;
      target.value = target.value.replace(/[^\d:.]/g, '');
      const time = timeToMs(target.value);
      if (time) {
        setPctgs([quali && time / quali, race && time / race]);
      } else {
        setPctgs([undefined, undefined]);
      }
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
          <Tr
            borderLeft={`3px solid ${
              qualiPctg ? getPctgColor(100 * qualiPctg) : 'transparent'
            }`}
          >
            <Th>QUALI</Th>
            <Td>{qualiPctg && formatRatioAsPctg(qualiPctg)}&nbsp;</Td>
          </Tr>
          <Tr
            borderLeft={`3px solid ${
              racePctg ? getPctgColor(100 * racePctg) : 'transparent'
            }`}
          >
            <Th>RACE</Th>
            <Td>{racePctg && formatRatioAsPctg(racePctg)}&nbsp;</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};
