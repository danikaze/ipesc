import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { DataFilter } from 'components/data-filter';
import { DriversRankChart } from 'components/charts/drivers-rank-chart';

import { useDriversPage } from './hooks';
import { DataFilteredProvider } from 'components/data-provider';

export const DriversPage: FC = () => {
  const {
    filter,
    updateFilter,
    filteredData,
    isAccSelected,
    filterChangeTime,
    namedSeasons,
  } = useDriversPage();

  return (
    <Page>
      <Heading size='md' marginBottom={4}>
        Drivers Ranking
      </Heading>
      <DataFilter
        showChampionships
        showGame
        showAccVersion={isAccSelected}
        championshipList={namedSeasons}
        onChange={updateFilter}
        value={filter}
      />
      <DataFilteredProvider filter={filter}>
        <DriversRankChart key={filterChangeTime} />
      </DataFilteredProvider>
    </Page>
  );
};
