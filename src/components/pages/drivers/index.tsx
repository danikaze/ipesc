import { FC, ReactNode } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Select,
  Text,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { DataFilter } from 'components/data-filter';
import { DriversRankChart } from 'components/charts/drivers-rank-chart';
import { DataFilteredProvider } from 'components/data-provider';

import { useDriversPage } from './hooks';

export const DriversPage: FC = () => {
  const {
    filter,
    updateFilter,
    isAccSelected,
    namedSeasons,
    chartOptions,
    updateLapFields,
    updateMinEvents,
    updateMaxPctg,
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
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <Text fontWeight='bold'>Ranking options</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Box>
              <Text>Rank drivers based on:</Text>
              {renderLapFieldOptions(updateLapFields, chartOptions.lapField)}
            </Box>
            <Box>
              Include people only if participated in more of N events{' '}
              {renderMinEventOptions(updateMinEvents, 5, chartOptions.minEvents)}
            </Box>
            <Box>
              Include people only if they are faster than %
              {renderMaxPctgOptions(updateMaxPctg, 150, chartOptions.maxPctg)}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <DataFilteredProvider filter={filter}>
        <DriversRankChart {...chartOptions} />
      </DataFilteredProvider>
    </Page>
  );
};

function renderLapFieldOptions(
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
  current: string | undefined
) {
  return (
    <Select value={current} onChange={onChange}>
      <option value='bestCleanLapTime'>Best Clean Lap Time</option>
      <option value='avgCleanLapTime'>Average Clean Lap Time</option>
      <option value='averageLapTime'>Average Lap Time</option>
    </Select>
  );
}

function renderMinEventOptions(
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
  max: number,
  current: number | undefined
) {
  const options: ReactNode[] = [
    <option key='no-limit' value=''>
      No limit
    </option>,
  ];

  for (let i = 1; i <= max; i++) {
    options.push(
      <option key={i} value={i}>
        {i} event{i === 1 ? '' : 's'}
      </option>
    );
  }

  return (
    <Select value={current || ''} onChange={onChange}>
      {options}
    </Select>
  );
}

function renderMaxPctgOptions(
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
  max: number,
  current: number | undefined
) {
  const options: ReactNode[] = [
    <option key='no-limit' value=''>
      No limit
    </option>,
  ];

  for (let i = 101; i <= max; i++) {
    options.push(
      <option key={i} value={i / 100}>
        {i}%
      </option>
    );
  }

  return (
    <Select value={current || ''} onChange={onChange}>
      {options}
    </Select>
  );
}
