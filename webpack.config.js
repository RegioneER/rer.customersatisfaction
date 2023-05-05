const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (webpackEnv, argv) => {
  const env = dotenv.config().parsed;
  let envKeys = {};
  if (env) {
    envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});
  }

  const isProduction = argv.mode === 'production';

  // browser dir so as we have all the messaround with staticfiles there
  const pkgDir = path.resolve(
    __dirname,
    './src/rer/customersatisfaction/browser/static',
  );
  const buildPath = isProduction
    ? path.resolve(pkgDir, './dist/prod')
    : path.resolve(pkgDir, './dist/dev');
  return {
    entry: {
      history: path.resolve(pkgDir, './apps/history/javascripts/history/index.js'),
      customer_satisfaction_global: path.resolve(pkgDir, './apps/customer_satisfaction_global/src/index.js'),
    },
    output: {
      path: buildPath,
      filename: '[name].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(envKeys),
      ...(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
      new MiniCssExtractPlugin(),
    ],
    devServer: {
      contentBase: buildPath,
      hot: !isProduction,
      port: 3000,
      writeToDisk: true,
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env','@babel/preset-react'] },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            'postcss-loader',
            {
              loader: 'less-loader',
              options: {
                paths: 'node_modules',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true, // true outputs JSX tags
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    // externals: {
    //   jquery: "jQuery"
    // }
  };
};
