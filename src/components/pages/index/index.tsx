import { FC } from 'react';
import { Container, Flex, Image } from '@chakra-ui/react';

import ipescLogo from 'assets/ipesc-logo.png';

import { Page } from 'components/page';
import { useIndexPage } from './hooks';

export const IndexPage: FC = () => {
  const { logoRef } = useIndexPage();

  return (
    <Page>
      <Container maxWidth='350px' h='100%'>
        <Flex h='100%' justifyContent='center' alignItems='center'>
          <Image ref={logoRef} src={ipescLogo} />
        </Flex>
      </Container>
    </Page>
  );
};
