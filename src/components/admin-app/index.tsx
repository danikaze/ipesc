import { FC } from 'react';
import { Box, Container, Kbd, Link, ListItem, OrderedList, Text } from '@chakra-ui/react';
import { Code, Grid, GridItem, Heading } from '@chakra-ui/layout';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { CodeBlock } from 'components/code-block';
import { useAdminApp } from './hooks';
import { HelpersInstallation } from './helpers-installation';

export const AdminApp: FC = () => {
  const {} = useAdminApp();

  return (
    <Container maxW='6xl' h='100%' maxH='100%'>
      <Grid
        h='100%'
        maxH='100%'
        templateAreas='"header" "main" "footer"'
        gridTemplateColumns='100%'
        gridTemplateRows='75px auto 30px'
      >
        <GridItem area='header' borderBottom='1px solid #bdbdbd'>
          <Heading margin={4}>IPESC Admin & Tools page</Heading>
        </GridItem>
        <GridItem area='main'>
          <Box scrollMarginY={4}>
            <Heading size='md'>SGP Result Page Utilities</Heading>
            <HelpersInstallation />
          </Box>
          <Box my={4}>
            <Text>
              After following the steps, the <Code>ipesc</Code> namespace will be
              available with the utility functions in your browser console.
            </Text>
            <Heading size='sm' marginTop={4}>
              Example: Retrieve the text to show the results of a finished race on
              discord.
            </Heading>
            <OrderedList my={2}>
              <ListItem>
                Navigate to the event page for a finished race,{' '}
                <Link
                  href='https://app.simracing.gp/events/z28x2BVIl6ptHfzuza4a1'
                  color='teal.500'
                  isExternal
                >
                  like this one <ExternalLinkIcon mx={2} />
                </Link>
                .
              </ListItem>
              <ListItem>
                Open the DevTools in your browser (i.e. <Kbd>F12</Kbd>).
              </ListItem>
              <ListItem>
                Enter the following command:
                <CodeBlock withCaret>ipesc.getResultsForDiscord();</CodeBlock>
              </ListItem>
            </OrderedList>
            <Text>
              After a few seconds fetching the race information, the generated text to
              copy/paste into Discord will appear (extra flavor text might be needed as
              well as replacing driver names with discord tags).
            </Text>
          </Box>
        </GridItem>
        <GridItem area='footer' borderTop='1px solid #bdbdbd'>
          <Text align='center' color='orange'>
            <Link href='index.html'>IPESC Data management</Link>
          </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};
