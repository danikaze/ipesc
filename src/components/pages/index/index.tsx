import { FC } from 'react';
import { Container, Flex, Image } from '@chakra-ui/react';

import ipescLogo from 'assets/ipesc-logo.png';

import { Page } from 'components/page';
import { useIndexPage } from './hooks';
import { Changelog } from 'components/changelog';

export const IndexPage: FC = () => {
  const { logoRef } = useIndexPage();

  return (
    <Page>
      <Container h='100%' maxWidth='100%'>
        <Flex flexDirection='column'>
          <Flex width='100%' justifyContent='center' alignItems='center' flexGrow={1}>
            <Container maxWidth='350px' h='100%' m={8}>
              <Image ref={logoRef} src={ipescLogo} />
            </Container>
          </Flex>
          <Container maxWidth='100%'>
            <Changelog />
          </Container>
        </Flex>
      </Container>
    </Page>
  );
};
