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

import { TrackRecord, TrackData } from 'data/types';
import { msToTime } from 'utils/time';
import { getPctgColor } from 'utils/get-pctg-color';
import { formatRatioAsPctg } from 'utils/format-data';
import { useRawData } from 'components/data-provider';

export interface Props {
  track: TrackData;
}

export const MAX_PCTG = 108;

export const TrackDetails: FC<Props> = ({ track }) => {
  const bestQuali = track.best.quali?.lapTime;
  const bestRace = track.best.race?.lapTime;
  const best = Math.min(bestQuali ?? Infinity, bestRace || Infinity);

  return (
    <AccordionItem data-track-name={track.name} data-track-id={track.id}>
      <AccordionButton>
        <Flex flexGrow='1' justifyContent='space-between'>
          <Text fontWeight='bold' noOfLines={1}>
            {track.name}
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
          <Times track={track} />
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
          {quali && <Th>Quali</Th>}
          {race && <Th>Race</Th>}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};

const Times: FC<{
  track: TrackData;
}> = ({ track }) => {
  const query = useRawData();
  const { quali, race } = query.getTrackRecords(track);
  const bestQuali = quali?.[0]?.lapTime;
  const bestRace = race?.[0]?.lapTime;

  const rows: ReactNode[] = [];
  for (let i = 0; i < Math.max(quali?.length || 0, race?.length || 0); i++) {
    rows.push(
      <Tr key={i}>
        <Th textAlign='right'>{`#${i + 1}`}</Th>
        {bestQuali && <TimeRow data={quali?.[i]} best={bestQuali} />}
        {bestRace && <TimeRow data={race?.[i]} best={bestRace} />}
      </Tr>
    );
  }

  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th></Th>
          {bestQuali && <Th>Quali</Th>}
          {bestRace && <Th>Race</Th>}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};

const TimeRow: FC<{
  data: TrackRecord | undefined;
  best: number | undefined;
}> = ({ data, best }) => {
  if (!data || !best) return null;

  const query = useRawData();
  const ratio = data.lapTime / best;
  const border = ratio && `3px solid ${getPctgColor(ratio * 100)}`;

  const time = msToTime(data.lapTime);
  const driver = query.getDriverName(data.driverId);
  const car = query.getCarName(data.carId);
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
