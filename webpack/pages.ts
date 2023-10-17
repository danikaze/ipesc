import { Configuration } from 'webpack';
import 'webpack-dev-server';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { absPath } from './utils/abs-path';
import { getPagesEntries } from './utils/get-pages-entries';
import { getFnsDefine } from './utils/get-fns-define';
import { webpackConfig } from './base';

const HASH_SIZE = 8;

export const pagesConfig = webpackConfig((config, isProduction) => {
  const entries = getPagesEntries(absPath('src/entries'), isProduction);

  config.entry = entries.entry;
  config.output = {
    clean: true,
    path: absPath('dist'),
    filename: `[name]-[contenthash:${HASH_SIZE}].js`,
  };
  config.optimization!.splitChunks = {
    cacheGroups: {
      vendors: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
      },
    },
  };
  config.devServer = {
    open: true,
    host: 'localhost',
    watchFiles: [absPath('src/**/*')],
    hot: true,
  };
  config.plugins!.push(...entries.plugins);
  config.plugins!.push(
    new MiniCssExtractPlugin({
      filename: `styles-[contenthash:${HASH_SIZE}].css`,
    })
  );
  config.plugins!.push(getFnsDefine(absPath('dist-fns')));

  return config as Configuration;
});
