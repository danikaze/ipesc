import { FC, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';

import { hideLoadingLogo } from 'utils/hide-loading-logo';
import { DataProvider } from 'components/data-provider';
import { IndexPage } from 'components/pages/index';
import { DynamicEntriesPage } from 'components/pages/entries/dynamic';
import { DynamicTracksPage } from 'components/pages/tracks/dynamic';
import { DynamicDriversPage } from 'components/pages/drivers/dynamic';

export const App: FC = () => {
  useEffect(() => {
    hideLoadingLogo();
  }, []);

  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/entries' element={<EntriesPage />} />
          <Route path='/tracks' element={<TracksPage />} />
          <Route path='/drivers' element={<DriversPage />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

const CenteredSpinner = () => (
  <Flex width='100%' height='100%' justifyContent='center' alignItems='center'>
    <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
  </Flex>
);

const EntriesPage = () => (
  <Suspense fallback={<CenteredSpinner />}>
    <DynamicEntriesPage />
  </Suspense>
);

const TracksPage = () => (
  <Suspense fallback={<CenteredSpinner />}>
    <DynamicTracksPage />
  </Suspense>
);

const DriversPage = () => (
  <Suspense fallback={<CenteredSpinner />}>
    <DynamicDriversPage />
  </Suspense>
);
