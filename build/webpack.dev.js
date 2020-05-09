const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { setMPA } = require('./utils');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  mode: 'development',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    ...htmlWebpackPlugins,
    new FriendlyErrorsWebpackPlugin(),
  ],
  devServer: {
    contentBase: '../dist',
    open: false,
    hot: true,
    stats: 'errors-only',
  },
  devtool: 'eval-source-map',
};
