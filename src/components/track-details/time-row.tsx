import { FC } from 'react';
import { Box, Flex, Td, Text } from '@chakra-ui/react';

import { useRawData } from 'components/data-provider';
import { TrackRecord } from 'data/types';
import { formatRatioAsPctg } from 'utils/format-data';
import { getPctgColor } from 'utils/get-color';
import { msToTime } from 'utils/time';

export const TimeRow: FC<{
  data: TrackRecord | undefined;
  best: number | undefined;
}> = ({ data, best }) => {
  if (!data || !best) return null;

  const query = useRawData();
  const ratio = data.lapTime / best;
  const border = ratio && `3px solid ${getPctgColor(ratio * 100)}`;

  const time = msToTime(data.lapTime);
  const driver = query.getDriverName(data.driverId);
  const car = query.getCarName(data.carId);
  const date = new Date(data.date).toDateString();

  return (
    <Td borderLeft={border} title={formatRatioAsPctg(data.lapTime / best)}>
      <Box>
        <Text as='span' fontWeight='bold' mr={4}>
          {time}
        </Text>
        <Text as='span'>{driver}</Text>
      </Box>
      <Flex justifyContent='space-between'>
        <Text fontSize='xs' color='GrayText'>
          {car}
        </Text>
        <Text fontSize='xs' color='GrayText'>
          {date}
        </Text>
      </Flex>
    </Td>
  );
};
