import { Configuration } from 'webpack';
import { absPath } from './utils/abs-path';
import { getFnsEntries } from './utils/get-fns-entries';
import { webpackConfig } from './base';
import { WebpackUserScriptPlugin } from './utils/webpack-user-script-plugin';

export const fnsConfig = webpackConfig((config, isProduction) => {
  config.entry = getFnsEntries(absPath('src/fns'), isProduction);
  config.output = {
    ...config.output,
    clean: true,
    path: absPath('dist-fns'),
    filename: `[name].js`,
  };

  config.plugins = [...(config.plugins || []), new WebpackUserScriptPlugin()];

  return config as Configuration;
});
