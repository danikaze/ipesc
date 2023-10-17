import { BannerPlugin, Configuration, DefinePlugin, version } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { getFileComment } from './utils/file-comment';
import { getDateString } from './utils/get-date-string';
import { jsonify } from './utils/jsonify';

export type WebpackConfigCreator = (
  base: Partial<Configuration>,
  isProduction: boolean
) => Configuration;

export const webpackConfig: (fn: WebpackConfigCreator) => () => Configuration = (fn) => {
  const isProduction = process.env.NODE_ENV == 'production';
  const base: Partial<Configuration> = {
    mode: isProduction ? 'production' : 'development',
    stats: {
      assetsSort: 'name',
      modules: false,
      children: false,
    },
    devtool: false,
    optimization: isProduction
      ? {
          minimizer: isProduction
            ? [
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
              ]
            : undefined,
        }
      : {},
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

  return () => fn(base, isProduction);
};
