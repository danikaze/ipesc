import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { ParticipationPerSeasonChart } from 'components/charts/participation-per-season';
import { ParticipationPerRaceChart } from 'components/charts/participation-per-race';
import { DataFilter } from 'components/data-filter';

import { useEntriesPage } from './hooks';
import { DataFilteredProvider } from 'components/data-provider';

export const EntriesPage: FC = () => {
  const { seasonFilter, raceFilter, setRaceFilter, setSeasonFilter } = useEntriesPage();

  return (
    <Page>
      <Heading size='md'>Participation per season</Heading>
      <DataFilter showChampionships onChange={setSeasonFilter} value={seasonFilter} />
      <DataFilteredProvider filter={seasonFilter}>
        <ParticipationPerSeasonChart />
      </DataFilteredProvider>

      <Heading size='md' marginTop={8}>
        Participation per race
      </Heading>
      <DataFilter showChampionships onChange={setRaceFilter} value={raceFilter} />
      <DataFilteredProvider filter={raceFilter}>
        <ParticipationPerRaceChart />
      </DataFilteredProvider>
    </Page>
  );
};
