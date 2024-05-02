import { FC } from 'react';
import {
  Box,
  Flex,
  HStack,
  Heading,
  ListItem,
  Text,
  Tooltip,
  UnorderedList,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import { NumericInput } from 'components/numeric-input';

import { useStintSimulator } from './hooks';
import { StintSummary } from './stint-summary';

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
    stintDurationHours,
    stintDurationMins,
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
    updateStintDurationHours,
    updateStintDurationMins,
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
      <StintDuration
        hours={stintDurationHours}
        mins={stintDurationMins}
        updateHours={updateStintDurationHours}
        updateMins={updateStintDurationMins}
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

const StintDuration: FC<{
  hours: string | undefined;
  mins: string | undefined;
  updateHours: (value: string) => void;
  updateMins: (value: string) => void;
}> = ({ hours, mins, updateHours, updateMins }) => {
  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Stint Duration
      </Heading>
      <Flex justifyContent='space-between'>
        <NumericInput
          placeholder='00'
          value={hours}
          min={0}
          onChange={updateHours}
          marginRight={2}
          label='Hrs'
          width='50%'
        />
        <NumericInput
          placeholder='00'
          value={mins}
          min={0}
          onChange={updateMins}
          label='Mins'
          width='50%'
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
