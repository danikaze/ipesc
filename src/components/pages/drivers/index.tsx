import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Game } from 'data/types';
import { Page } from 'components/page';
import { WaitForData } from 'components/wait-for-data';
import { DataFilter } from 'components/data-filter';
import { DriversRankChart } from 'components/charts/drivers-rank-chart';

import { useDriversPage } from './hooks';

export const DriversPage: FC = () => {
  const { filteredData, isAccSelected, filterChangeTime, setFilter } = useDriversPage();
  console.log(filteredData);
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
          onChange={setFilter}
          defaultValue={{ game: Game.ACC }}
        />
        <DriversRankChart key={filterChangeTime} data={filteredData!} />
      </WaitForData>
    </Page>
  );
};
