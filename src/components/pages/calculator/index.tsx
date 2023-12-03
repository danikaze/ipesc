import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { FuelCalculator } from 'components/fuel-calculator';

export const CalculatorPage: FC = () => {
  return (
    <Page>
      <Heading size='md' marginBottom={4}>
        Fuel Calculator
      </Heading>
      <FuelCalculator />
    </Page>
  );
};
