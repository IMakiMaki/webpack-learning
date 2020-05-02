// 需要做打包vendor处理或者cdn引入的库(提升构建速度)
// 更多配置参考：https://www.npmjs.com/package/html-webpack-externals-plugin
module.exports = [
  {
    module: 'react',
    // entry: 'https://cdn.bootcss.com/react/16.13.1/cjs/react.production.min.js', cdn方式不会构建vendor包而是直接引入cdn地址
    entry: 'umd/react.production.min.js', // 实际上如果不是引用cdn的方式去做externals 不如使用splitChunks去做分离 这样不用关心全局变量global的设定etc...
    global: 'React'
  },
  {
    module: 'react-dom',
    entry: 'umd/react-dom.production.min.js',
    global: 'ReactDOM'
  }
];
