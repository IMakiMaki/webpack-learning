const path = require('path');
const DllPlugin = require('webpack').DllPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    library: ['react', 'react-dom', 'babel-polyfill'],
  },
  output: {
    filename: '[name]_[hash].dll.js',
    path: path.join(__dirname, '../library'),
    library: '[name]_[hash]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, './library/[name].json'),
    }),
  ],
};
