import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

export interface Props {
  items: (SummaryItemProps | undefined | false)[];
  children?: ReactNode;
}

export interface SummaryItemProps {
  label: ReactNode;
  data: number | string | undefined;
  main?: boolean;
}

export const Summary: FC<Props> = ({ items, children }) => (
  <Box marginTop={4}>
    <Heading size='md' marginTop={4} marginBottom={2}>
      Summary
    </Heading>
    {children && <Box marginBottom={4}>{children}</Box>}
    <>
      {items.filter(Boolean).map((item, i) => (
        <SummaryItem key={i} {...(item as SummaryItemProps)} />
      ))}
    </>
  </Box>
);

const SummaryItem: FC<SummaryItemProps> = ({ label, data, main }) => (
  <Flex marginTop={2} paddingBottom={2} borderBottom='1px solid' borderColor='gray.200'>
    <Box w='50%'>
      <Text>{label}</Text>
    </Box>
    <Box w='50%'>
      <Text fontWeight={main ? 'bold' : undefined}>{data}</Text>
    </Box>
  </Flex>
);
