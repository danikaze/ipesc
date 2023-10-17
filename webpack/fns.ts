import { Configuration } from 'webpack';
import { absPath } from './utils/abs-path';
import { getFnsEntries } from './utils/get-fns-entries';
import { webpackConfig } from './base';

export const fnsConfig = webpackConfig((config, isProduction) => {
  config.entry = getFnsEntries(absPath('src/fns'), isProduction);
  config.output = {
    clean: true,
    path: absPath('dist-fns'),
    filename: `[name].js`,
  };

  return config as Configuration;
});
