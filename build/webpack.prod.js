const webpack = require('webpack');
const { setMPA } = require('./utils');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const { entry, htmlWebpackPlugins, htmlWebpackExternalsPlugins } = setMPA();
module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  mode: 'production',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    ...htmlWebpackPlugins,
    // ...htmlWebpackExternalsPlugins, // 用来抽出指定在externals.config.js中的库到 /dist/vendor
    // new HtmlInlineCssWebpackPlugin(), 用来将css内联到html中
    new FriendlyErrorsWebpackPlugin(),
    // 手动捕获构建错误
    function () {},
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        commons: {
          test: /[\\/]src[\\/]common[\\/]/,
          name: 'commons',
          chunks: 'all',
        },
      },
    },
  },
  stats: 'errors-only',
};
