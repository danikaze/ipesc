import { ChangeEventHandler, FC, ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  Heading,
  ListItem,
  Select,
  Text,
  Tooltip,
  UnorderedList,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import { NumericInput } from 'components/numeric-input';
import { msToTime } from 'utils/time';

import { Summary, Props as SummaryProps } from '../summary';
import { useStintSimulator, LapData, SimulationData } from './hooks';

export interface Props {
  raceDuration: number | undefined;
  totalLaps: number | undefined;
  lapTime: number | undefined;
  fuelPerLap: number | undefined;
  fuelTank: number | undefined;
  extraLaps: number | undefined;
}

export const StintSimulator: FC<Props> = (props) => {
  const {
    simulations,
    pitWindowHours,
    pitWindowMins,
    minPitstops,
    maxPitstops,
    pitstopSecs,
    lapDegradationSecs,
    selectedSimulationIndex,
    updatePitWindowHours,
    updatePitWindowMins,
    updateMinPitstops,
    updateMaxPitstops,
    updatePitstopSecs,
    updateLapDegradationSecs,
    updateSelectedSimulation,
  } = useStintSimulator(props);

  return (
    <Box>
      <PitStops
        min={minPitstops}
        max={maxPitstops}
        updateMin={updateMinPitstops}
        updateMax={updateMaxPitstops}
      />
      <PitWindow
        hours={pitWindowHours}
        mins={pitWindowMins}
        updateHours={updatePitWindowHours}
        updateMins={updatePitWindowMins}
      />
      <PitstopTime value={pitstopSecs} update={updatePitstopSecs} />
      <LapDegradation value={lapDegradationSecs} update={updateLapDegradationSecs} />
      <StintSummary
        simulations={simulations}
        update={updateSelectedSimulation}
        selectedIndex={selectedSimulationIndex}
      />
    </Box>
  );
};

const PitWindow: FC<{
  hours: string | undefined;
  mins: string | undefined;
  updateHours: (value: string) => void;
  updateMins: (value: string) => void;
}> = ({ hours, mins, updateHours, updateMins }) => {
  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Pit Window duration
      </Heading>
      <Flex>
        <NumericInput
          placeholder='00'
          value={hours}
          min={0}
          label='Hours'
          onChange={updateHours}
          marginRight={2}
        />
        <NumericInput
          placeholder='00'
          value={mins}
          min={0}
          label='Mins'
          onChange={updateMins}
        />
      </Flex>
    </Box>
  );
};

const PitStops: FC<{
  min: number | undefined;
  max: number | undefined;
  updateMin: (value: string) => void;
  updateMax: (value: string) => void;
}> = ({ min, max, updateMin, updateMax }) => {
  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Pit Stops
      </Heading>
      <Flex>
        <NumericInput
          placeholder='0'
          value={min}
          min={0}
          max={max}
          label='Min'
          labelSide='left'
          onChange={updateMin}
          marginRight={2}
        />
        <NumericInput
          placeholder='0'
          value={max}
          min={min || 0}
          label='Max'
          labelSide='left'
          onChange={updateMax}
        />
      </Flex>
    </Box>
  );
};

const PitstopTime: FC<{
  value: string | undefined;
  update: (value: string) => void;
}> = ({ value, update }) => {
  const info = (
    <Box padding={2}>
      <Text>Average time lost when entering pits.</Text>
      <UnorderedList>
        <ListItem>
          <Text size='sm' fontWeight='normal'>
            Simple way to calculate it: Measure the time since entering into the pitlane
            until exiting it, including refueling and tires change.
          </Text>
        </ListItem>
        <ListItem>
          <Text size='sm' fontWeight='normal'>
            Accurate way to calculate it: Measure the time of two laps with a pit stop in
            the middle and check the difference of two laps without the time stop.
          </Text>
        </ListItem>
      </UnorderedList>
    </Box>
  );

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        <HStack>
          <Text>Time lost on pits</Text>
          <Tooltip hasArrow label={info}>
            <InfoIcon boxSize={3} color='gray.300' />
          </Tooltip>
        </HStack>
      </Heading>
      <Text fontSize='xs' marginBottom={2} color='gray.400'>
        Difference between regular lap times and pitting lap times.
      </Text>
      <NumericInput
        placeholder='00'
        value={value}
        min={0}
        label='Secs'
        onChange={update}
      />
    </Box>
  );
};

const LapDegradation: FC<{
  value: string | undefined;
  update: (value: string) => void;
}> = ({ value, update }) => {
  const info = (
    <Box padding={2}>
      <Text>This takes into consideration the tire degradation over time.</Text>
      <UnorderedList>
        <ListItem>
          <Text size='sm' fontWeight='normal'>
            Simple way to calculate it: Do 10-20 laps and compare your average laps at the
            beginning with the time after 10 or 20 laps. Input that delta here.
          </Text>
        </ListItem>
      </UnorderedList>
      <Text size='sm' fontWeight='normal'>
        It is not required by all means, but having it will allow for a better strategy
        considering the time lost on long stints.
      </Text>
      <Text size='sm' fontWeight='normal'>
        Note that this might impact the result (adding a delta per lap on extreme cases
        might result on one less lap in the race simulation). Use with caution or add some{' '}
        <Text as='span' fontWeight='bold'>
          Extra Laps
        </Text>
        .
      </Text>
    </Box>
  );

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        <HStack>
          <Text>Laptime degradation after 10 laps</Text>
          <Tooltip hasArrow label={info}>
            <InfoIcon boxSize={3} color='gray.300' />
          </Tooltip>
        </HStack>
      </Heading>
      <Text fontSize='xs' marginBottom={2} color='gray.400'>
        Difference between lap times of laps 1 and 10.
      </Text>
      <NumericInput
        placeholder='0.00'
        value={value}
        min={0}
        label='Secs'
        step={0.1}
        onChange={update}
      />
    </Box>
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
  fuel,
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
  const fuelInfo = fuel && (
    <Text as='span'>
      <Text as='span' color={labelColor}>
        Remaining fuel:
      </Text>{' '}
      <Text as='span' color={fuel < (fuelPerLap || 1) ? 'red' : undefined}>
        {fuel.toFixed(2)}
      </Text>{' '}
      L{' '}
      {fuelPerLap && (
        <Text as='span' color='whiteAlpha.700'>
          ({Math.floor(fuel / fuelPerLap)} laps)
        </Text>
      )}
    </Text>
  );
  const pittingFuel = typeof pits === 'number' && (
    <Text as='span' color='green.400' ml={2}>
      +{pits.toFixed(2)} L
    </Text>
  );
  const pitting = pits && <Text>Box{pittingFuel}</Text>;

  return (
    <Box marginTop={2}>
      {lapTitle}
      {currentLapTime}
      {pitting}
      {fuelInfo}
      {ellapsedRaceTime}
    </Box>
  );
};

const StintSummary: FC<{
  simulations: SimulationData[];
  selectedIndex: number;
  update: ChangeEventHandler<HTMLSelectElement>;
}> = ({ simulations, selectedIndex, update }) => {
  const simulation = simulations[selectedIndex];

  const stintDescription: SummaryProps['items'] = [
    simulation && {
      label: 'Race start',
      data: simulation?.initialFuel
        ? `${simulation?.initialFuel.toFixed(0)} L`
        : undefined,
    },
    ...(simulation?.stops || []).map(({ lap, fuel }, i) => ({
      label: `Pit stop #${i} at lap ${lap}`,
      data: fuel ? `${fuel} L` : undefined,
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
      {simulations.map((s) => (
        <option key={`${s.stops.length}-${s.raceTime}`} value={s.stops.length}>
          {s.stops.length} {s.stops.length === 1 ? 'stop' : 'stops'} 【{s.laps.length}{' '}
          laps | {msToTime(s.raceTime)}】
        </option>
      ))}
    </Select>
  );
};
