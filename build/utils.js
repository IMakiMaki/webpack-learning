const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');

module.exports = {
  setMPA(type = '') {
    let suffix = type ? '-' + type : '';
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, `../src/pages/*/index${suffix}.js`));
    entryFiles.forEach((entryFile) => {
      const match = entryFile.match(new RegExp(`src/pages/(.*)/index${suffix}.js`));
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `../src/pages/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', 'commons', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: type === 'server' ? false : true, // 服务端渲染需要把注释开启 不然会删掉占位符
          },
        })
      );
    });

    return {
      entry,
      htmlWebpackPlugins,
    };
  },
};
