import { FC, useMemo } from 'react';
import { Accordion, Heading, Text } from '@chakra-ui/react';

import { Game } from 'data/types';
import { Page } from 'components/page';
import { WaitForData } from 'components/wait-for-data';
import { DataFilter } from 'components/data-filter';
import { TrackDetails } from 'components/track-details';

import { useTracksPage } from './hooks';

export const TracksPage: FC = () => {
  const { tracks, isAccSelected, setFilter, getDriverName, getCarName } = useTracksPage();

  const trackElems = useMemo(() => {
    if (!tracks) return null;
    const list = tracks.map((track) => (
      <TrackDetails
        key={track.id}
        data={track}
        getDriverName={getDriverName}
        getCarName={getCarName}
      />
    ));
    return <Accordion allowMultiple>{list}</Accordion>;
  }, [tracks]);

  return (
    <Page>
      <Heading size='md' marginBottom={4}>
        Track Records
      </Heading>
      <WaitForData data={tracks}>
        <DataFilter
          showGame
          showAccVersion={isAccSelected}
          onChange={setFilter}
          defaultValue={{ game: Game.ACC }}
        />
        <Text fontStyle='italic' margin={4}>
          Tracks may appear repeated due to the IDs received from SGP.
        </Text>
        {trackElems}
      </WaitForData>
    </Page>
  );
};
