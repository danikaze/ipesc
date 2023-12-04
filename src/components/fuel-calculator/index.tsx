import { ChangeEventHandler, FC } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import { StintSimulator } from 'components/fuel-calculator/stint-simulator';
import { NumericInput } from 'components/numeric-input';
import { msToTime } from 'utils/time';

import { Summary } from './summary';
import { useFuelCalculator } from './hooks';

export const FuelCalculator: FC = () => {
  const {
    mode,
    raceTimeHours,
    raceTimeMins,
    lapTimeMins,
    lapTimeSecs,
    fuelPerLap,
    fuelTank,
    extraLaps,
    totalLaps,
    totalFuel,
    lapMs,
    raceMs,
    raceTime,
    updateMode,
    updateRaceTimeHours,
    updateRaceTimeMins,
    updateLapTimeMins,
    updateLapTimeSecs,
    updateFuelPerLap,
    updateFuelTank,
    updateExtraLaps,
  } = useFuelCalculator();

  return (
    <>
      <Container marginTop={8}>
        <ModeSelector value={mode} update={updateMode} />
        <RaceTime
          hours={raceTimeHours}
          mins={raceTimeMins}
          updateHours={updateRaceTimeHours}
          updateMins={updateRaceTimeMins}
        />
        <AverageLapTime
          mins={lapTimeMins}
          secs={lapTimeSecs}
          updateMins={updateLapTimeMins}
          updateSecs={updateLapTimeSecs}
        />
        <FuelPerLap mode={mode} value={fuelPerLap} update={updateFuelPerLap} />
        <FuelTank mode={mode} value={fuelTank} update={updateFuelTank} />
        <ExtraLaps value={extraLaps} update={updateExtraLaps} />
      </Container>
      <CalculationSummary
        mode={mode}
        totalFuel={totalFuel}
        totalLaps={totalLaps}
        raceTime={raceTime}
      />
      <StintsSimulation
        mode={mode}
        raceDuration={raceMs}
        lapTime={lapMs}
        totalLaps={totalLaps}
        fuelPerLap={fuelPerLap}
        fuelTank={fuelTank}
        extraLaps={extraLaps}
      />
    </>
  );
};

const ModeSelector: FC<{
  value: string;
  update: ChangeEventHandler<HTMLSelectElement>;
}> = ({ value, update }) => {
  const colors: Record<typeof value, string> = {
    acc: 'green.50',
    ac: 'red.50',
    enduro: 'blue.50',
  };

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Mode
      </Heading>
      <Select value={value} onChange={update} fontWeight='bold' bgColor={colors[value]}>
        <option value='acc'>ACC Style</option>
        <option value='ac'>AC Style</option>
        <option value='enduro'>Endurance mode</option>
      </Select>
    </Box>
  );
};

const RaceTime: FC<{
  hours: string;
  mins: string;
  updateHours: (value: string) => void;
  updateMins: (value: string) => void;
}> = ({ hours, mins, updateHours, updateMins }) => {
  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Race time
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

const AverageLapTime: FC<{
  mins: string;
  secs: string;
  updateMins: (value: string) => void;
  updateSecs: (value: string) => void;
}> = ({ mins, secs, updateMins, updateSecs }) => {
  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Average lap time
      </Heading>
      <Flex justifyContent='space-between'>
        <NumericInput
          placeholder='00'
          value={mins}
          min={0}
          onChange={updateMins}
          marginRight={2}
          label='Mins'
          width='50%'
        />
        <NumericInput
          placeholder='00'
          value={secs}
          min={0}
          onChange={updateSecs}
          label='Secs'
          width='50%'
        />
      </Flex>
    </Box>
  );
};

const FuelPerLap: FC<{
  mode: string;
  value: string;
  update: (value: string) => void;
}> = ({ mode, value, update }) => {
  if (mode === 'ac') return null;

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Fuel per lap
      </Heading>
      <NumericInput
        placeholder='0.00'
        value={value}
        min={0}
        onChange={update}
        label='Litres'
        step={0.1}
        width='100%'
      />
    </Box>
  );
};

const FuelTank: FC<{
  mode: string;
  value: string;
  update: (value: string) => void;
}> = ({ mode, value, update }) => {
  if (mode !== 'enduro') return null;

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        Fuel tank capacity
      </Heading>
      <NumericInput
        placeholder='00'
        value={value}
        min={0}
        onChange={update}
        label='Litres'
        width='100%'
      />
    </Box>
  );
};

const ExtraLaps: FC<{ value: string | undefined; update: (value: string) => void }> = ({
  value,
  update,
}) => {
  const info = (
    <Box padding={2}>
      <Text>Add fuel for extra laps when specified.</Text>
      <Text size='sm' fontWeight='normal'>
        Can be useful when racing with formation laps, taking advanced strategies such as
        overcut, or just adding some error margin to the calculations.
      </Text>
    </Box>
  );

  return (
    <Box marginTop={4}>
      <Heading marginBottom={1} size='xs'>
        <HStack>
          <Text>Extra Laps</Text>
          <Tooltip hasArrow label={info}>
            <InfoIcon boxSize={3} color='gray.300' />
          </Tooltip>
        </HStack>
      </Heading>
      <Text fontSize='xs' marginBottom={2} color='gray.400'>
        Additional laps to add to the calculation.
      </Text>
      <NumericInput
        placeholder='0'
        value={value}
        onChange={update}
        min={0}
        label='Laps'
        width='100%'
      />
    </Box>
  );
};

const CalculationSummary: FC<{
  mode: string;
  totalFuel: number | undefined;
  totalLaps: number | undefined;
  raceTime: number | undefined;
}> = ({ mode, totalFuel, totalLaps, raceTime }) => {
  if (mode === 'enduro') return;

  return (
    <Container marginTop={8}>
      <Summary
        items={[
          mode !== 'ac' && {
            label: 'Total Fuel Needed',
            data: totalFuel ? `${totalFuel} L` : undefined,
            main: true,
          },
          { label: 'Total Laps', data: totalLaps, main: mode === 'ac' },
          { label: 'Expected Race Time', data: msToTime(raceTime, { ms: false }) },
        ]}
      />
    </Container>
  );
};

const StintsSimulation: FC<{
  mode: string;
  raceDuration: number | undefined;
  lapTime: number | undefined;
  totalLaps: number | undefined;
  fuelPerLap: string | undefined;
  fuelTank: string | undefined;
  extraLaps: string | undefined;
}> = ({ mode, raceDuration, lapTime, totalLaps, fuelPerLap, fuelTank, extraLaps }) => {
  if (mode !== 'enduro') return;

  return (
    <Container marginTop={8}>
      <Heading size='md' marginTop={4} marginBottom={2}>
        Stints Simulations
      </Heading>
      <StintSimulator
        raceDuration={raceDuration}
        lapTime={lapTime}
        totalLaps={totalLaps}
        fuelPerLap={Number(fuelPerLap) || undefined}
        fuelTank={Number(fuelTank) || undefined}
        extraLaps={Number(extraLaps) || undefined}
      />
    </Container>
  );
};
