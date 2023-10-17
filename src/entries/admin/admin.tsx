import './styles.scss';

import { createRoot } from 'react-dom/client';
import { App } from 'components/app';
import { getFnSource } from 'utils/get-fn-source';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

console.log('results-page.js\n', getFnSource('results-page'));
