import { FC, RefObject, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';

import { Category, EventType, TrackData, TrackRecord } from 'data/types';
import { DataQuery } from 'data/data-query';
import { useRawData } from 'components/data-provider';
import { msToTime } from 'utils/time';
import { cluster } from 'utils/cluster';

import { PercentageCalculator } from './percentage-calculator';
import { Percentages } from './percentages';
import { Times } from './times';
import { CategoryTimes } from './category-times';

export interface Props {
  track: TrackData;
}

export type CategoryBests = Partial<Record<EventType, Record<Category, number>>>;

const MAX_PCTG = 108;

export const TrackDetails: FC<Props> = memo(({ track }) => {
  /*
   * Optimize rendering the content of the panel only when shown.
   * (if not, page gets really heavy due to the number of DOM elements)
   *
   * Can't rely on `isExpanded` because we need to render _before_ it's
   * expanded so the size is calculated properly, so we use an internal state
   *
   * Try to rely on the real expanded state of the panel (via aria-expanded)
   * but it still has a bug when clicking 3 times quick in a row (which was
   * original from chakra, not this state management)
   */
  const [showPanel, setShowPanel] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const isShown = useCallback(
    () => buttonRef.current?.getAttribute('aria-expanded') === 'true',
    []
  );
  const togglePannel = useCallback(() => setShowPanel(!isShown()), [isShown]);
  const clickHandler = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isShown()) {
      return togglePannel();
    }
    const ANIM_MS = 250;
    timeoutRef.current = setTimeout(togglePannel, ANIM_MS);
  }, [isShown]);

  return (
    <AccordionItem data-track-name={track.name} data-track-id={track.id}>
      {renderTrackDetailsContents(track, showPanel, buttonRef, clickHandler)}
    </AccordionItem>
  );
});

function renderTrackDetailsContents(
  track: TrackData,
  showPanel: boolean,
  ref: RefObject<HTMLButtonElement>,
  toggleContents: () => void
) {
  const query = useRawData();
  const bestQuali = track.best.quali?.lapTime;
  const bestRace = track.best.race?.lapTime;
  const best = Math.min(bestQuali ?? Infinity, bestRace || Infinity);
  const { quali, race } = getCategoryTimes(query, track);

  const accordionButton = useMemo(
    () => (
      <AccordionButton ref={ref} onClick={toggleContents}>
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
    ),
    [track]
  );
  const accordionPanelContents = useMemo(
    () => (
      <Flex>
        <Box mr={4}>
          <Percentages max={MAX_PCTG} quali={quali} race={race} />
          <CategoryTimes quali={quali} race={race} />
          <PercentageCalculator quali={quali} race={race} />
        </Box>
        <Times track={track} />
      </Flex>
    ),
    [track]
  );

  return (
    <>
      {accordionButton}
      <AccordionPanel>{showPanel && accordionPanelContents}</AccordionPanel>
    </>
  );
}

function getCategoryTimes(query: DataQuery, track: TrackData): CategoryBests {
  const res: CategoryBests = {};
  const { quali, race } = query.getTrackRecords(track);

  if (quali) {
    res.quali = getCategoryBests(quali);
  }
  if (race) {
    res.race = getCategoryBests(race);
  }

  return res;
}

function getCategoryBests(records: TrackRecord[]): Record<Category, number> {
  const qualiTimes = records.map((record) => record.lapTime);
  const qualiCategories = cluster(3, qualiTimes, identity);
  return {
    [Category.PRO]: Math.min(...qualiCategories[0]),
    [Category.SILVER]: Math.min(...qualiCategories[1]),
    [Category.AM]: Math.min(...qualiCategories[2]),
  };
}

function identity(x: number) {
  return x;
}
