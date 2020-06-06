const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const CheckDllFilesWebpackPlugin = require('./plugins/CheckDllFilesWebpackPlugin');
const webpack = require('webpack');

const DllReferencePlugin = webpack.DllReferencePlugin;
const { setMPA } = require('./utils');
const { entry, htmlWebpackPlugins } = setMPA();
const smp = new SpeedMeasurePlugin({ disable: true });
// 打包时间分析开启时会使htmlWebpackExternalsPlugins inject失效 原因或许是：
// https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/92

module.exports = smp.wrap({
  entry: entry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  mode: 'production',
  resolve: {
    alias: {
      // 经过试验，指定入口文件目前不能优化构建速度了
      // react: path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js'),
      // 'react-dom': path.resolve(
      //   __dirname,
      //   '../node_modules/react-dom/umd/react-dom.production.min.js'
      // ),
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js'],
    mainFields: ['main'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2, // 多线程开启反而打包速度会变慢，原因未知 也许是因为电脑cpu主频太弱，或者是webpack4本身就有优化
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          'eslint-loader',
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
            },
          },
        ],
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
    new HardSourceWebpackPlugin(),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'library/*.js'), to: 'vendors/', flatten: true },
    ]),
    ...htmlWebpackPlugins,
    new DllReferencePlugin({
      manifest: require('./library/library.json'),
    }),
    new HtmlWebpackTagsPlugin({
      // 引入dll分包打包后的library
      tags: [
        {
          append: false,
          path: 'vendors',
          glob: '*.js',
          globPath: path.resolve(__dirname, './library'),
        },
      ],
      /* 可以直接用HtmlWebpackTagsPlugin来代替htmlExternalsWebpackPlugin
      // 同时这个插件可以用来给一些基础库分离 但是在启用了dll分包打包后就不需要拿来分离了
      scripts: [
        {
          path: 'vendors/js/react.production.min.js',
          external: {
            packageName: 'react',
            variableName: 'React',
          },
          attributes: {
            type: 'text/javascript',
          },
        },
        {
          path: 'vendors/js/react-dom.production.min.js',
          external: {
            packageName: 'react-dom',
            variableName: 'ReactDOM',
          },
          attributes: {
            type: 'text/javascript',
          },
        },
      ], */
    }),
    // new HtmlInlineCssWebpackPlugin(), 用来将css内联到html中
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    // new CheckDllFilesWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        exclude: /[\\/]node_modules[\\/]/,
        parallel: true,
        cache: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      // cacheGroups: {
      //   // 将node_modules的包分离
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: 'vendors',
      //     chunks: 'all',
      //   },
      //   // 将commons的包分离
      //   commons: {
      //     test: /[\\/]src[\\/]common[\\/]/,
      //     name: 'commons',
      //     chunks: 'all',
      //   },
      // },
    },
  },
  stats: 'errors-only',
});
