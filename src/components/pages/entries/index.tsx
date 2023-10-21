import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

import { Page } from 'components/page';
import { DataProvider } from 'components/data-provider';

export const EntriesPage: FC = () => {
  return (
    <DataProvider>
      <Page>
        <Heading>Entries</Heading>
      </Page>
    </DataProvider>
  );
};
