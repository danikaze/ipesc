import { ReactNode } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

import { ProcessedData } from 'data/types';

export interface Props<T> {
  data: T | undefined;
  children: ReactNode;
}

export function WaitForData<T = ProcessedData>({ data, children }: Props<T>) {
  if (data) return children;

  return (
    <Flex width='100%' justifyContent='center' alignItems='center' my={4}>
      <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
    </Flex>
  );
}
