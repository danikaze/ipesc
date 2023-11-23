import { FC, useMemo } from 'react';
import { Accordion, Heading, Text } from '@chakra-ui/react';

import { Page } from 'components/page';
import { DataFilter } from 'components/data-filter';
import { LinkTo } from 'components/link-to';
import { TrackDetails } from 'components/track-details';

import { useTracksPage } from './hooks';

export const TracksPage: FC = () => {
  const { filter, tracks, isAccSelected, setFilter } = useTracksPage();

  const trackElems = useMemo(() => {
    const list = tracks.map((track) => (
      <TrackDetails key={`${track.id}:${track.version}`} track={track} />
    ));
    return <Accordion allowMultiple>{list}</Accordion>;
  }, [tracks]);

  return (
    <Page>
      <Heading size='md' marginBottom={4}>
        Track Records
      </Heading>
      <DataFilter
        showGame
        showAccVersion={isAccSelected}
        onChange={setFilter}
        value={filter}
      />
      <Text fontStyle='italic' margin={4}>
        ※ Tracks may appear repeated due to the IDs received from SGP.
      </Text>
      <Text fontStyle='italic' margin={4}>
        ※ ACC Versions are based on{' '}
        <LinkTo isExternal url='https://www.acc-wiki.info/wiki/Changelogs_Overview'>
          ACC Release dates
        </LinkTo>{' '}
        vs Event dates.
      </Text>
      {trackElems}
    </Page>
  );
};
