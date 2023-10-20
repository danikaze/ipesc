import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import 'webpack-dev-server';

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
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/](react|chakra-ui|@emotion|framer-motion)/,
          chunks: 'all',
        },
      },
    },
  };
  config.devServer = {
    open: true,
    host: 'localhost',
    watchFiles: [absPath('src/**/*')],
    hot: true,
  };

  config.plugins = [
    ...(config.plugins || []),
    ...entries.plugins,
    getFnsDefine(absPath('dist-fns')),
    new MiniCssExtractPlugin({
      filename: `styles-[contenthash:${HASH_SIZE}].css`,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: isProduction ? 'static' : 'disabled',
      reportFilename: '../webpack/report.html',
    }),
  ];

  return config as Configuration;
});
