import { FC } from 'react';
import { Flex, Image } from '@chakra-ui/react';

import ipescLogo from 'assets/ipesc-logo.png';

import { Page } from 'components/page';
import { useIndexPage } from './hooks';

export const IndexPage: FC = () => {
  const { logoRef } = useIndexPage();

  return (
    <Page>
      <Flex h='100%' justifyContent='center' alignItems='center'>
        <Image ref={logoRef} src={ipescLogo} />
      </Flex>
    </Page>
  );
};
