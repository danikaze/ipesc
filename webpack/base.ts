import { BannerPlugin, Configuration, DefinePlugin } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { version } from '../package.json';
import { getFileComment } from './utils/file-comment';
import { getCssLocalIdent } from './utils/get-css-local-ident';
import { getDateString } from './utils/get-date-string';
import { jsonify } from './utils/jsonify';

export type WebpackConfigCreator = (
  base: Partial<Configuration>,
  isProduction: boolean
) => Configuration;

export const HASH_SIZE = 8;

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
        // code
        {
          test: /\.(ts|tsx)$/i,
          loader: 'ts-loader',
          exclude: ['/node_modules/'],
        },
        // css modules
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: getCssLocalIdent(),
                },
                sourceMap: true,
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
          include: /\.module\.s?(c|a)ss$/,
        },
        // css (non-module)
        {
          test: /\.(css|scss|less)$/,
          exclude: /\.module\.(css|scss|less)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        // assets
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          use: {
            loader: 'file-loader',
            options: { name: `[assets]/[hash:${HASH_SIZE}].[ext]` },
          },
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
