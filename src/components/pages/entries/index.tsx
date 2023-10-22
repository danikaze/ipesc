import { FC, ReactNode } from 'react';
import { Flex, Heading, Spinner } from '@chakra-ui/react';

import { ProcessedData } from 'data/types';
import { Page } from 'components/page';
import { ParticipationPerSeasonChart } from 'components/charts/participation-per-season';
import { ParticipationPerRaceChart } from 'components/charts/participation-per-race';
import { DataFilter } from 'components/data-filter';

import { useEntriesPage } from './hooks';

export const EntriesPage: FC = () => {
  const { raceData, seasonData, setRaceFilter, setSeasonFilter } = useEntriesPage();

  return (
    <Page>
      <Heading size='md'>Participation per season</Heading>
      <WaitForData data={seasonData}>
        <DataFilter onChange={setSeasonFilter} defaultValue={{ championships: 'all' }} />
        <ParticipationPerSeasonChart data={seasonData!} />
      </WaitForData>

      <Heading size='md' marginTop={8}>
        Participation per race
      </Heading>
      <WaitForData data={raceData}>
        <DataFilter onChange={setRaceFilter} />
        <ParticipationPerRaceChart data={raceData!} />
      </WaitForData>
    </Page>
  );
};

const WaitForData: FC<{ data: ProcessedData | undefined; children: ReactNode }> = ({
  data,
  children,
}) => {
  if (data) return children;

  return (
    <Flex width='100%' justifyContent='center' alignItems='center' my={4}>
      <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
    </Flex>
  );
};
