import { FC } from 'react';
import {
  OrderedList,
  ListItem,
  Kbd,
  Code,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { CodeBlock } from 'components/code-block';
import { getFnSource } from 'utils/get-fn-source';

export const HelpersInstallation: FC = () => {
  return (
    <Box my={4}>
      <Text>To enable the utilities follow the next steps:</Text>
      <Accordion allowToggle defaultIndex={1}>
        <AccordionItem>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <Text fontWeight='bold'>As one time usage</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <OrderedList my={2}>
              <ListItem>Go to the results page of a simracing.gp race.</ListItem>
              <ListItem>
                Open the DevTools in your browser (i.e. <Kbd>F12</Kbd>).
              </ListItem>
              <ListItem>
                Copy the following code and execute it in the DevTools Console.
                <CodeBlock>{getFnSource('ipesc-helpers.user')}</CodeBlock>
              </ListItem>
            </OrderedList>
            <Text>
              It doesn't need anything else, but every time the page is reloaded it needs
              to be <em>installed</em> again with this steps.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              <Text fontWeight='bold'>As user script</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <OrderedList my={2}>
              <ListItem>
                Install the{' '}
                <Text color='teal.500' as='span'>
                  <Link
                    isExternal
                    href='https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo'
                  >
                    Tampermonkey <ExternalLinkIcon mx='2px' />
                  </Link>
                </Text>{' '}
                extension for Chrome (or{' '}
                <Text color='teal.500' as='span'>
                  <Link
                    isExternal
                    href='https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/'
                  >
                    Greasemonkey <ExternalLinkIcon mx='2px' />
                  </Link>
                </Text>{' '}
                for Firefox)
              </ListItem>
              <ListItem>
                Visit the{' '}
                <Text color='teal.500' as='span'>
                  <Link
                    isExternal
                    href='https://gist.github.com/danikaze/9154b3b79eb2c605687c78f4991841fd/raw/ipesc-helpers.user.js'
                  >
                    script link <ExternalLinkIcon mx='2px' />
                  </Link>
                </Text>{' '}
                and click the <Kbd>Install</Kbd> button.
              </ListItem>
              <ListItem>Go to the results page of a simracing.gp race.</ListItem>
              <ListItem>
                Open the DevTools in your browser (i.e. <Kbd>F12</Kbd>).
              </ListItem>
            </OrderedList>
            <Text>
              This way the <Code>ipesc</Code> functions will be enabled automatically
              every time simracing.gp is loaded.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
