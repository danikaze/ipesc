import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { ParticipationPerSeasonChart } from 'components/charts/participation-per-season';
import { ParticipationPerRaceChart } from 'components/charts/participation-per-race';
import { DataFilter } from 'components/data-filter';
import { WaitForData } from 'components/wait-for-data';

import { useEntriesPage } from './hooks';

export const EntriesPage: FC = () => {
  const {
    seasonFilter,
    raceFilter,
    raceData,
    seasonData,
    setRaceFilter,
    setSeasonFilter,
  } = useEntriesPage();

  return (
    <Page>
      <Heading size='md'>Participation per season</Heading>
      <WaitForData data={seasonData}>
        <DataFilter showChampionships onChange={setSeasonFilter} value={seasonFilter} />
        <ParticipationPerSeasonChart data={seasonData!} />
      </WaitForData>

      <Heading size='md' marginTop={8}>
        Participation per race
      </Heading>
      <WaitForData data={raceData}>
        <DataFilter showChampionships onChange={setRaceFilter} value={raceFilter} />
        <ParticipationPerRaceChart data={raceData!} />
      </WaitForData>
    </Page>
  );
};
