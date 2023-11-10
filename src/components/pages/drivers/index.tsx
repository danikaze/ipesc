import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { WaitForData } from 'components/wait-for-data';
import { DataFilter } from 'components/data-filter';
import { DriversRankChart } from 'components/charts/drivers-rank-chart';

import { useDriversPage } from './hooks';

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
      <WaitForData data={filteredData}>
        <DataFilter
          showChampionships
          showGame
          showAccVersion={isAccSelected}
          championshipList={namedSeasons}
          onChange={updateFilter}
          value={filter}
        />
        <DriversRankChart key={filterChangeTime} data={filteredData!} />
      </WaitForData>
    </Page>
  );
};
