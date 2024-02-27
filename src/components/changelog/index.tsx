import { FC, ReactNode } from 'react';
import {
  AbsoluteCenter,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Divider,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { LinkTo } from 'components/link-to';

export const Changelog: FC = () => {
  return (
    <Accordion allowToggle width='100%'>
      <AccordionItem>
        <AccordionButton>
          <Flex flexGrow='1' justifyContent='space-between'>
            <Text fontWeight='bold'>Change Log</Text>
            <AccordionIcon />
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          <ChangeList />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const ChangeList: FC = () => {
  return (
    <>
      <Version v='0.7.2'>
        <Change type='data'>Event data updated with the 4th and 5th races of S8.</Change>
      </Version>
      <Version v='0.7.1'>
        <Change type='data'>Event data updated with the 3rd race of S8.</Change>
      </Version>
      <Version v='0.7.0'>
        <Change type='data'>Event data updated with the 2 first races of S8.</Change>
        <Change type='minor'>
          Fixed srgp category values to include <Code>SILVER</Code> when generating
          results for discord.
        </Change>
      </Version>
      <Version v='0.6.1'>
        <Change type='minor'>
          Fixed minor bugs and added display improvements in the{' '}
          <LinkTo page='calculator'>Fuel Calculator</LinkTo> page.
        </Change>
      </Version>
      <Version v='0.6.0'>
        <Change>
          Added the <Code>Endurance Mode</Code> to the{' '}
          <LinkTo page='calculator'>Fuel Calculator</LinkTo> page.
        </Change>
        <Change>
          Parameters on the <LinkTo page='calculator'>Fuel Calculator</LinkTo> page are
          now remembered on page load.
        </Change>
        <Change type='data'>
          Event data updated with the last MX-5 S7.5 race (3/3).
        </Change>
        <Change type='minor'>
          Fixed the discord message generation where <Code>PRO</Code> appeared twice in
          the category titles instead of <Code>SIL</Code>.
        </Change>
      </Version>
      <Version v='0.5.0'>
        <Change>
          Added the <LinkTo page='calculator'>Fuel Calculator</LinkTo> page.
        </Change>
      </Version>
      <Version v='0.4.0'>
        <Change>
          Automatic clustering of drivers into <Code>PRO</Code>/<Code>SILVER</Code>/
          <Code>AM</Code> categories (applicable on <LinkTo page='tracks'>Tracks</LinkTo>{' '}
          and <LinkTo page='drivers'>Drivers</LinkTo> pages).
        </Change>
        <Change>Change Log visible here ^^.</Change>
        <Change type='data'>
          Updated event data until the end of the Rookies S3 season.
        </Change>
        <Change type='minor'>
          <LinkTo page='drivers'>Drivers</LinkTo> page doesn't break when there's no data
          after applying a filter.
        </Change>
        <Change type='minor'>
          <LinkTo page='tracks'>Tracks</LinkTo> page renders faster now.
        </Change>
        <Change type='minor'>
          Fix Percentages table width on the <LinkTo page='tracks'>Tracks</LinkTo> page.
        </Change>
      </Version>
      <Version v='0.3.0'>
        <Change>
          Add percentage calculator on the <LinkTo page='tracks'>Tracks</LinkTo> page.
        </Change>
        <Change>Improve data filtering.</Change>
        <Change type='data'>
          Event data updated until Rookies S3 (3/5) + MX-5 S7.5 (2/3).
        </Change>
        <Change type='minor'>
          Fix the duplicate active drivers count on multi-race events (sprints).
        </Change>
        <Change type='minor'>
          Auto log the output when calling <Code>ipesc.fetchChampionshipData()</Code> for
          easier data exporting.
        </Change>
      </Version>
    </>
  );
};

const Version: FC<{ v: string; children: ReactNode }> = ({ v, children }) => {
  return (
    <>
      <Box position='relative' padding={3} pt={4}>
        <Divider />
        <AbsoluteCenter bg='white' px='4'>
          <Text fontWeight='bold'>{v}</Text>
        </AbsoluteCenter>
      </Box>
      <Box>
        <UnorderedList>{children}</UnorderedList>
      </Box>
    </>
  );
};

const Change: FC<{ type?: 'minor' | 'data'; children: ReactNode }> = ({
  type,
  children,
}) => {
  const color = {
    minor: 'gray',
    data: '#c57a08',
  }[type!];

  return (
    <ListItem>
      <Text color={color}>{children}</Text>
    </ListItem>
  );
};
