import { Configuration, BannerPlugin, DefinePlugin } from 'webpack';
import 'webpack-dev-server';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

import { version } from '../package.json';
import { jsonify } from './jsonify';
import { getFileComment } from './file-comment';
import { getDateString } from './get-date-string';
import { absPath } from './abs-path';
import { getEntries } from './entries';

const isProduction = process.env.NODE_ENV == 'production';

const HASH_SIZE = 8;

export const config: () => Configuration = () => {
  const entries = getEntries(absPath('src/entries'), isProduction);

  return {
    mode: isProduction ? 'production' : 'development',
    entry: entries.entry,
    output: {
      clean: true,
      path: absPath('dist'),
      filename: `[name]-[contenthash:${HASH_SIZE}].js`,
    },
    stats: {
      assetsSort: 'name',
      modules: false,
      children: false,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            ecma: undefined,
            parse: {},
            compress: {},
            mangle: true,
            module: false,
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
        },
      },
    },
    devServer: {
      open: true,
      host: 'localhost',
      watchFiles: [absPath('src/**/*')],
      hot: true,
    },
    plugins: [
      ...entries.plugins,

      new MiniCssExtractPlugin({
        filename: `styles-[contenthash:${HASH_SIZE}].css`,
      }),

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
        {
          test: /\.(css|scss|less)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
      plugins: [new TsconfigPathsPlugin()],
    },
  };
};
