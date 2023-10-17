import { Configuration, BannerPlugin, DefinePlugin } from 'webpack';
import 'webpack-dev-server';
import * as TerserPlugin from 'terser-webpack-plugin';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

import { version } from '../package.json';
import { jsonify } from './utils/jsonify';
import { getFileComment } from './utils/file-comment';
import { getDateString } from './utils/get-date-string';
import { absPath } from './utils/abs-path';
import { getFnsEntries } from './utils/get-fns-entries';

const isProduction = process.env.NODE_ENV == 'production';

export const fnsConfig: () => Configuration = () => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: getFnsEntries(absPath('src/fns'), isProduction),
    output: {
      clean: true,
      path: absPath('dist-fns'),
      filename: `[name].js`,
    },
    stats: {
      assetsSort: 'name',
      modules: false,
      children: false,
    },
    optimization: isProduction
      ? {
          minimizer: [
            new TerserPlugin({
              parallel: true,
              extractComments: false,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                ecma: undefined,
                parse: {},
                compress: {},
                mangle: isProduction,
                module: false,
              },
            }),
          ],
        }
      : undefined,
    plugins: [
      new DefinePlugin(
        jsonify({
          'process.env.NODE_ENV': isProduction ? 'production' : 'development',
          'process.env.PACKAGE_VERSION': version,
          'process.env.BUILD_DATE': getDateString(),
        })
      ),
      new BannerPlugin({
        raw: true,
        banner: getFileComment,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: 'ts-loader',
          exclude: ['/node_modules/'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
      plugins: [new TsconfigPathsPlugin()],
    },
  };
};
