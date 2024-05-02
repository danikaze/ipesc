import { Configuration, DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import 'webpack-dev-server';

import { version } from '../package.json';

import { absPath } from './utils/abs-path';
import { getPagesEntries } from './utils/get-pages-entries';
import { getFnsDefine } from './utils/get-fns-define';
import { HASH_SIZE, webpackConfig } from './base';
import { jsonify } from './utils/jsonify';

export const pagesConfig = webpackConfig((config, isProduction) => {
  const entries = getPagesEntries(absPath('src/entries'), isProduction);

  config.entry = entries.entry;
  config.output = {
    ...config.output,
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
    new DefinePlugin(
      jsonify({
        'process.env.PACKAGE_VERSION': version,
      })
    ),
    new MiniCssExtractPlugin({
      filename: `styles-[contenthash:${HASH_SIZE}].css`,
    }),
  ];

  if (process.env.ANALYZER) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: isProduction ? 'static' : 'disabled',
        reportFilename: '../webpack/report.html',
      })
    );
  }

  return config as Configuration;
});
