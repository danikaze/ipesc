import 'styles/static.scss';

import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import { App } from 'components/app';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
