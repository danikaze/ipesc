import { Box, Flex, Select, Text, Tooltip } from '@chakra-ui/react';
import { ChangeEventHandler, FC, ReactNode } from 'react';

import { msToTime } from 'utils/time';
import { Summary, Props as SummaryProps } from '../summary';
import { LapData, SimulationData } from './hooks';
import { formatAsNth } from 'utils/format-data';

export interface Props {
  simulations: SimulationData[];
  selectedIndex: number;
  update: ChangeEventHandler<HTMLSelectElement>;
}

export const StintSummary: FC<Props> = ({ simulations, selectedIndex, update }) => {
  const simulation = simulations[selectedIndex];

  const stintDescription: SummaryProps['items'] = [
    simulation && {
      label: 'Race start',
      data: simulation?.initialFuel
        ? `${simulation?.initialFuel.toFixed(0)} L`
        : undefined,
    },
    ...(simulation?.stops || []).map(({ lap, fuel }, i) => ({
      label: (
        <>
          {formatAsNth(i + 1)} pit stop at end of lap {lap}
        </>
      ),
      data: fuel ? `${Math.round(fuel)} L` : undefined,
    })),
  ];

  return (
    <Summary
      items={[
        {
          label: 'Total Fuel Needed',
          data: simulation?.totalFuel
            ? `${simulation?.totalFuel.toFixed(0)} L`
            : undefined,
          main: true,
        },
        {
          label: 'Total Laps',
          data: simulation?.laps.length,
        },
        {
          label: 'Expected Race Time',
          data: msToTime(simulation?.raceTime, { ms: false }),
        },
        ...stintDescription,
      ]}
    >
      <SimulationsSelector
        simulations={simulations}
        update={update}
        selectedIndex={selectedIndex}
      />
      <Simulation simulation={simulation} />
    </Summary>
  );
};

const SimulationsSelector: FC<{
  simulations: SimulationData[];
  selectedIndex: number;
  update: ChangeEventHandler<HTMLSelectElement>;
}> = ({ simulations, selectedIndex, update }) => {
  if (!simulations.length) return;

  const value = simulations[selectedIndex]?.stops.length;

  return (
    <Select value={value} onChange={update}>
      {simulations.map((s, i) => (
        <option key={`${s.stops.length}-${s.raceTime}`} value={s.stops.length}>
          {s.stops.length} {s.stops.length === 1 ? 'stop' : 'stops'} 【{s.laps.length}{' '}
          laps | {msToTime(s.raceTime)}】
        </option>
      ))}
    </Select>
  );
};

const Simulation: FC<{
  simulation: SimulationData | undefined;
}> = ({ simulation }) => {
  const lapBars: ReactNode[] = [];
  if (simulation) {
    const { laps } = simulation;
    for (let i = 0; i < laps.length; i++) {
      lapBars.push(
        <Lap key={i} index={i} fuelPerLap={simulation.fuelPerLap} {...laps[i]} />
      );
    }
  } else {
    lapBars.push(
      <Flex key='no-laps' alignItems='center'>
        <Text align='center' color='gray.400'>
          Enter{' '}
          <Text as='span' fontWeight='medium'>
            Race
          </Text>{' '}
          and{' '}
          <Text as='span' fontWeight='medium'>
            Lap
          </Text>{' '}
          times to visualize data and make sure the number of{' '}
          <Text as='span' fontWeight='medium'>
            Pit Stops
          </Text>
          ,{' '}
          <Text as='span' fontWeight='medium'>
            Pit Window
          </Text>
          ,
          <Text as='span' fontWeight='medium'>
            Stint Duration
          </Text>{' '}
          and the{' '}
          <Text as='span' fontWeight='medium'>
            Fuel Tank Capacity
          </Text>{' '}
          have reasonable values.
        </Text>
      </Flex>
    );
  }

  return (
    <Box marginTop={4}>
      <Flex
        height='102px'
        width='100%'
        border='1px solid'
        borderColor='gray.200'
        position='relative'
      >
        {lapBars}
      </Flex>
    </Box>
  );
};

const Lap: FC<
  LapData & {
    index: number;
    fuelPerLap: number | undefined;
  }
> = ({ index, ...lapData }) => {
  const { width, height, pits, windowOpen } = lapData;
  const tooltip = <LapDetails index={index} {...lapData} />;

  return (
    <Tooltip hasArrow label={tooltip}>
      <Flex
        data-group
        height='100%'
        flexGrow={width}
        alignItems='flex-end'
        backgroundColor={pits ? 'blue.50' : windowOpen ? 'green.50' : 'white'}
        borderLeft={index === 0 ? undefined : '1px'}
        borderColor={'white'}
        _hover={{
          backgroundColor: pits ? 'blue.100' : windowOpen ? 'green.100' : 'gray.50',
        }}
      >
        <Box
          height={`${100 * height}%`}
          flexGrow={1}
          backgroundColor={pits ? 'blue.200' : 'orange.300'}
          _groupHover={{ backgroundColor: pits ? 'blue.400' : 'orange.400' }}
        />
      </Flex>
    </Tooltip>
  );
};

const LapDetails: FC<LapData & { index: number; fuelPerLap?: number }> = ({
  index,
  fuelPerLap,
  lapTime,
  delta,
  raceTime,
  fuelOnStart,
  fuelOnEnd,
  stint,
  stintLap,
  pits,
}) => {
  const labelColor = 'whiteAlpha.800';
  const lapTitle = (
    <Text>
      <Text as='span' color={pits ? 'blue.400' : 'orange.400'} fontWeight='bold'>
        Lap {index + 1}
      </Text>
      <Text as='span' color='whiteAlpha.700' ml={2}>
        (S{stint + 1} L{stintLap + 1})
      </Text>
    </Text>
  );
  const deltaInfo = delta ? (
    <Text as='span' size='sm'>
      <Text as='span' color='red.400' ml={2}>
        <Text as='span' size='xs'>
          ▲
        </Text>{' '}
        {msToTime(delta, { min: false })}
      </Text>{' '}
      s
    </Text>
  ) : undefined;
  const currentLapTime = (
    <Text>
      <Text as='span' color={labelColor}>
        LapTime:
      </Text>{' '}
      {msToTime(lapTime)}
      {deltaInfo}
    </Text>
  );
  const ellapsedRaceTime = (
    <Text>
      <Text as='span' color={labelColor}>
        Racetime:
      </Text>{' '}
      {msToTime(raceTime, { ms: false })}
    </Text>
  );
  const fuelStartInfo = fuelOnStart && (
    <Text as='span'>
      <Text as='span' color={labelColor}>
        Fuel on lap start:
      </Text>{' '}
      <Text as='span' color={fuelOnStart < (fuelPerLap || 1) ? 'red' : undefined}>
        {fuelOnStart.toFixed(2)}
      </Text>{' '}
      L{' '}
      {fuelPerLap && (
        <Text as='span' color='whiteAlpha.700'>
          ({Math.floor(fuelOnStart / fuelPerLap)} laps)
        </Text>
      )}
    </Text>
  );

  const pittingFuel = typeof pits === 'number' && (
    <Text as='span' color='green.400' ml={2}>
      +{Math.round(pits)} L
    </Text>
  );
  const fuelEndInfo = fuelOnEnd && (
    <Text as='span' color='gray.300'>
      {' '}
      (
      <Text as='span' color={fuelOnEnd < (fuelPerLap || 1) ? 'red' : undefined}>
        {fuelOnEnd.toFixed(2)}
      </Text>{' '}
      L remaining)
    </Text>
  );
  const pitting = pits && (
    <Text>
      Box{fuelEndInfo}
      {pittingFuel}
    </Text>
  );

  return (
    <Box marginTop={2}>
      {lapTitle}
      {currentLapTime}
      {pitting}
      {fuelStartInfo}
      {ellapsedRaceTime}
    </Box>
  );
};
