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
const webpack = require('webpack');

const DllReferencePlugin = webpack.DllReferencePlugin;
const { setMPA } = require('./utils');
const { entry, htmlWebpackPlugins } = setMPA();
const smp = new SpeedMeasurePlugin({ disable: true }); // 打包时间分析开启时会使htmlWebpackExternalsPlugins inject失效 原因未知

module.exports = smp.wrap({
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
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader',
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
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    new CopyWebpackPlugin([
      // { from: 'node_modules/react/umd/react.production.min.js', to: 'vendors/js' },
      // { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: 'vendors/js' },
      { from: path.join(__dirname, 'library/*.js'), to: 'vendors/', flatten: true },
    ]),
    ...htmlWebpackPlugins,
    new HtmlWebpackTagsPlugin({
      // 引入dll分包打包后的library
      tags: [
        {
          append: true,
          path: 'vendors',
          glob: '*.js',
          globPath: path.join(__dirname, '../dist/vendors/'),
        },
      ],
      /*  // 可以直接用HtmlWebpackTagsPlugin来代替htmlExternalsWebpackPlugin
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
    // new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new DllReferencePlugin({
      manifest: require('./library/library.json'),
    }),
    // 手动捕获构建错误
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--watch') === -1
        ) {
          console.log('build error');
        }
      });
    },
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        exclude: /[\\/]node_modules[\\/]/,
        parallel: 3,
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
  // stats: 'errors-only',
});
