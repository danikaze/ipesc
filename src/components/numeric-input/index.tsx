import { FC } from 'react';
import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

export interface Props {
  onChange: (value: string) => void;
  label: string;
  labelSide?: 'left' | 'right';
  value: string | number | undefined;
  min?: number;
  max?: number;
  placeholder?: string;
  marginRight?: number | string;
  step?: number;
  width?: number | string;
}

export const NumericInput: FC<Props> = ({
  onChange,
  label,
  labelSide,
  value,
  min,
  max,
  step,
  marginRight,
  width,
  placeholder,
}) => (
  <Flex
    w={width}
    mr={marginRight}
    flexDirection={labelSide === 'left' ? 'row-reverse' : undefined}
  >
    <NumberInput
      value={value}
      step={step}
      min={min}
      max={max}
      flexGrow={1}
      onChange={onChange}
    >
      <NumberInputField
        placeholder={placeholder}
        borderLeftRadius={labelSide === 'left' ? 0 : undefined}
        borderRightRadius={labelSide !== 'left' ? 0 : undefined}
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
      borderLeft={labelSide !== 'left' ? 0 : undefined}
      borderRight={labelSide === 'left' ? 0 : undefined}
      borderRightRadius={labelSide !== 'left' ? 'md' : undefined}
      borderLeftRadius={labelSide === 'left' ? 'md' : undefined}
      alignItems='center'
      justifyContent='center'
      px={2}
    >
      {label}
    </Flex>
  </Flex>
);
