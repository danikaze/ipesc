import { fnsConfig } from './webpack/fns';
import { pagesConfig } from './webpack/pages';

const configs = {
  fns: fnsConfig,
  pages: pagesConfig,
  default: [fnsConfig, pagesConfig],
};
module.exports = configs[(process.env.WEBPACK_ONLY || 'default') as keyof typeof configs];
