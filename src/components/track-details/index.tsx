import { FC, ReactNode } from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { Car, Driver, TrackBestData, TrackData } from 'data/types';
import { msToTime } from 'utils/time';
import { getPctgColor } from 'utils/get-pctg-color';
import { formatRatioAsPctg } from 'utils/format-data';

export interface Props {
  data: TrackData;
  getDriverName?: (driverId: Driver['id']) => string | undefined;
  getCarName?: (carId: Car['id']) => string | undefined;
}

export const MAX_PCTG = 108;

export const TrackDetails: FC<Props> = ({ data, getDriverName, getCarName }) => {
  const bestQuali = data.best.quali[0]?.lapTime;
  const bestRace = data.best.race[0]?.lapTime;
  const best = Math.min(bestQuali ?? Infinity, bestRace || Infinity);
  return (
    <AccordionItem data-track-name={data.name} data-track-id={data.id}>
      <AccordionButton>
        <Flex flexGrow='1' justifyContent='space-between'>
          <Text fontWeight='bold' noOfLines={1}>
            {data.name}
          </Text>{' '}
          <Text mr={2} fontSize='sm' color='GrayText'>
            {msToTime(best)}
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Flex>
          <Percentages quali={bestQuali} race={bestRace} />
          <Times
            quali={data.best.quali}
            race={data.best.race}
            getDriverName={getDriverName}
            getCarName={getCarName}
          />
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

const Percentages: FC<{ quali?: number; race?: number }> = ({ quali, race }) => {
  const rows: ReactNode[] = [];
  for (let p = 100; p <= MAX_PCTG; p++) {
    const color = getPctgColor(p);

    rows.push(
      <Tr key={p} borderLeft={`3px solid ${color}`} borderBottom={`1px solid ${color}`}>
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
      mr={4}
      backgroundColor='#f1f1f1'
      borderRadius={5}
    >
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Quali</Th>
          <Th>Race</Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};

const Times: FC<{
  quali: TrackBestData[];
  race: TrackBestData[];
  getDriverName: Props['getDriverName'];
  getCarName: Props['getCarName'];
}> = ({ quali, race, getDriverName, getCarName }) => {
  const rows: ReactNode[] = [];
  for (let i = 0; i < Math.max(quali.length, race.length); i++) {
    const bestQuali = quali[0]?.lapTime;
    const bestRace = race[0]?.lapTime;

    rows.push(
      <Tr key={i}>
        <Th textAlign='right'>{`#${i + 1}`}</Th>
        <TimeRow
          data={quali[i]}
          best={bestQuali}
          getDriverName={getDriverName}
          getCarName={getCarName}
        />
        <TimeRow
          data={race[i]}
          best={bestRace}
          getDriverName={getDriverName}
          getCarName={getCarName}
        />
      </Tr>
    );
  }

  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Quali</Th>
          <Th>Race</Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};

const TimeRow: FC<{
  data: TrackBestData | undefined;
  best: number | undefined;
  getDriverName: Props['getDriverName'];
  getCarName: Props['getCarName'];
}> = ({ data, best, getDriverName, getCarName }) => {
  if (!data || !best) return null;

  const ratio = data.lapTime / best;
  const border = ratio && `3px solid ${getPctgColor(ratio * 100)}`;

  const time = msToTime(data.lapTime);
  const driver = getDriverName?.(data.driverId);
  const car = getCarName?.(data.carId);
  const date = new Date(data.date).toDateString();

  return (
    <Td borderLeft={border} title={formatRatioAsPctg(data.lapTime / best)}>
      <Box>
        <Text as='span' fontWeight='bold' mr={4}>
          {time}
        </Text>
        <Text as='span'>{driver}</Text>
      </Box>
      <Flex justifyContent='space-between'>
        <Text fontSize='xs' color='GrayText'>
          {car}
        </Text>
        <Text fontSize='xs' color='GrayText'>
          {date}
        </Text>
      </Flex>
    </Td>
  );
};
