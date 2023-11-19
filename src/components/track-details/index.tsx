import { FC } from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';

import { TrackData } from 'data/types';
import { msToTime } from 'utils/time';

import { PercentageCalculator } from './percentage-calculator';
import { Percentages } from './percentages';
import { Times } from './times';

export interface Props {
  track: TrackData;
}

export const MAX_PCTG = 108;

export const TrackDetails: FC<Props> = ({ track }) => {
  const bestQuali = track.best.quali?.lapTime;
  const bestRace = track.best.race?.lapTime;
  const best = Math.min(bestQuali ?? Infinity, bestRace || Infinity);

  return (
    <AccordionItem data-track-name={track.name} data-track-id={track.id}>
      <AccordionButton>
        <Flex flexGrow='1' justifyContent='space-between'>
          <Text fontWeight='bold' noOfLines={1}>
            {track.name}
          </Text>{' '}
          <Text mr={2} fontSize='sm' color='GrayText'>
            {msToTime(best)}
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Flex>
          <Box mr={4}>
            <Percentages max={MAX_PCTG} quali={bestQuali} race={bestRace} />
            <PercentageCalculator quali={bestQuali} race={bestRace} />
          </Box>
          <Times track={track} />
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
