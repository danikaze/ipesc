import { FC } from 'react';
import { Box, Container, Kbd, Link, ListItem, OrderedList, Text } from '@chakra-ui/react';
import { Code, Grid, GridItem, Heading } from '@chakra-ui/layout';

import { CodeBlock } from 'components/code-block';
import { getFnSource } from 'utils/get-fn-source';
import { useAdminApp } from './hooks';

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
          <Box padding={4}>
            <Heading size='md'>SGP Result Page Utilities</Heading>
            <Text>To enable the utilities follow the next steps:</Text>
            <OrderedList>
              <ListItem>Go to the results page of a simracing.gp race.</ListItem>
              <ListItem>
                Open the DevTools in your browser (i.e. <Kbd>F12</Kbd>).
              </ListItem>
              <ListItem>
                Copy the following code and execute it in the DevTools Console.
                <CodeBlock>{getFnSource('results-page')}</CodeBlock>
              </ListItem>
            </OrderedList>
            <Text>
              After following the steps, the <Code>ipesc</Code> namespace will be
              available with utility tools in your window.
            </Text>
          </Box>
          <Box padding={4}>
            <Heading size='sm'>Example</Heading>
            <Text>
              Retrieve the text to show the results of a race on discord (while having
              selected the <Code>RACE</Code> tab on simracing.gp)
            </Text>
            <CodeBlock withCaret>ipesc.getResultsForDiscord();</CodeBlock>
          </Box>
        </GridItem>
        <GridItem area='footer' borderTop='1px solid #bdbdbd'>
          <Text align='center' color='teal.500'>
            <Link href='index.html'>IPESC Data management</Link>
          </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};
