import { FC } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';

import { useFuelCalculator } from './hooks';

interface NumericInputProps {
  onChange: (value: string) => void;
  label: string;
  value: string | number | undefined;
  placeholder?: string;
  marginRight?: number | string;
  step?: number;
  width?: number | string;
}

interface SummaryDataProps {
  label: string;
  data: number | string | undefined;
  main?: boolean;
}

export const FuelCalculator: FC = () => {
  const {
    raceTimeHours,
    raceTimeMins,
    lapTimeMins,
    lapTimeSecs,
    fuelPerLap,
    extraLaps,
    totalLaps,
    totalFuel,
    raceTime,
    updateRaceTimeHours,
    updateRaceTimeMins,
    updateLapTimeMins,
    updateLapTimeSecs,
    updateFuelPerLap,
    updateExtraLaps,
  } = useFuelCalculator();

  return (
    <>
      <Container marginTop={8}>
        <Heading size='md'>Race Data</Heading>
        <Box marginTop={4}>
          <Heading marginBottom={1} size='xs'>
            Race time
          </Heading>
          <Flex justifyContent='space-between'>
            <NumericInput
              value={raceTimeHours}
              onChange={updateRaceTimeHours}
              marginRight={2}
              label='Hrs'
              width='50%'
            />
            <NumericInput
              value={raceTimeMins}
              onChange={updateRaceTimeMins}
              label='Mins'
              width='50%'
            />
          </Flex>
        </Box>
        <Box marginTop={4}>
          <Heading marginBottom={1} size='xs'>
            Average lap time
          </Heading>
          <Flex justifyContent='space-between'>
            <NumericInput
              value={lapTimeMins}
              onChange={updateLapTimeMins}
              marginRight={2}
              label='Mins'
              width='50%'
            />
            <NumericInput
              value={lapTimeSecs}
              onChange={updateLapTimeSecs}
              label='Secs'
              width='50%'
            />
          </Flex>
        </Box>
        <Box marginTop={4}>
          <Heading marginBottom={1} size='xs'>
            Fuel per lap
          </Heading>
          <NumericInput
            value={fuelPerLap}
            onChange={updateFuelPerLap}
            label='Litres'
            step={0.1}
            width='100%'
          />
        </Box>
        <Box marginTop={4}>
          <Heading marginBottom={1} size='xs'>
            Extra Laps
          </Heading>
          <NumericInput
            value={extraLaps}
            onChange={updateExtraLaps}
            label='Laps'
            width='100%'
            placeholder='0'
          />
        </Box>
      </Container>
      <Container marginTop={8}>
        <Heading size='md' marginTop={4} marginBottom={2}>
          Summary
        </Heading>
        <SummaryData
          label='Total Fuel Needed'
          data={totalFuel ? `${totalFuel} L` : undefined}
          main
        />
        <SummaryData label='Total Laps' data={totalLaps} />
        <SummaryData label='Expected Race Time' data={raceTime} />
      </Container>
    </>
  );
};

const NumericInput: FC<NumericInputProps> = ({
  onChange,
  label,
  value,
  step,
  marginRight,
  width,
  placeholder,
}) => (
  <Flex w={width} mr={marginRight}>
    <NumberInput value={value} step={step} min={0} flexGrow={1} onChange={onChange}>
      <NumberInputField
        placeholder={placeholder ?? (step && step % 1 !== 0 ? '0.00' : '00')}
        borderRightRadius={0}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
    <Flex
      border='1px solid'
      borderColor='gray.200'
      backgroundColor='gray.50'
      color='gray.500'
      borderLeft={0}
      borderRightRadius='md'
      alignItems='center'
      justifyContent='center'
      px={2}
    >
      {label}
    </Flex>
  </Flex>
);

const SummaryData: FC<SummaryDataProps> = ({ label, data, main }) => (
  <Flex marginTop={2} paddingBottom={2} borderBottom='1px solid' borderColor='gray.200'>
    <Box w='50%'>
      <Text>{label}</Text>
    </Box>
    <Box w='50%'>
      <Text fontWeight={main ? 'bold' : undefined}>{data}</Text>
    </Box>
  </Flex>
);
