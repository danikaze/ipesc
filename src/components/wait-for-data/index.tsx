import { FC, ReactNode } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import { ProcessedData } from 'data/types';

export const WaitForData: FC<{
  data: ProcessedData | undefined;
  children: ReactNode;
}> = ({ data, children }) => {
  if (data) return children;

  return (
    <Flex width='100%' justifyContent='center' alignItems='center' my={4}>
      <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
    </Flex>
  );
};
