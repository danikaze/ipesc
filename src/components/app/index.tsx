import { FC, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';

import { DynamicGraphDriverProgressPage } from 'components/pages/graph-driver-progress/dynamic';
import { DynamicGraphSeasonRacesPctg } from 'components/pages/graph-session-races-pctg/dynamic';
import { IndexPage } from 'components/pages/index';
import { hideLoadingLogo } from 'utils/hide-loading-logo';

export const App: FC = () => {
  useEffect(() => {
    hideLoadingLogo();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/driver' element={<DriverPage />} />
        <Route path='/season' element={<SeasonPage />} />
      </Routes>
    </HashRouter>
  );
};

const CenteredSpinner = () => (
  <Flex width='100%' height='100%' justifyContent='center' alignItems='center'>
    <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
  </Flex>
);

const DriverPage = () => (
  <Suspense fallback={<CenteredSpinner />}>
    <DynamicGraphDriverProgressPage />
  </Suspense>
);

const SeasonPage = () => (
  <Suspense fallback={<CenteredSpinner />}>
    <DynamicGraphSeasonRacesPctg />
  </Suspense>
);
