import { FC, ReactNode } from 'react';
import { Tr, Th, Table, Thead, Tbody } from '@chakra-ui/react';

import { useRawData } from 'components/data-provider';
import { TrackData } from 'data/types';

import { TimeRow } from './time-row';

export interface Props {
  track: TrackData;
}

export const Times: FC<Props> = ({ track }) => {
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
