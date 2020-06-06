const path = require('path');
const glob = require('glob-all');

// 创建一个检查dll是否生成的webpack插件
// create a plugin for webpack to check the DllReference files existed or not.
class CheckDllFilesWebpackPlugin {
  constructor(options) {
    this.dllFiles = options.dllFiles || [];
  }
  // 将 `apply` 定义为其原型方法，此方法以 compiler 作为参数
  apply(compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.beforeRun.tapAsync('CheckDllLibraryPlugin', (compilation, callback) => {
      const getFiles = glob.sync([path.join(__dirname, `../src/pages/*/index${suffix}.js`)]);

      throw new Error(
        "Can't find dllReference files, maybe you should create DllReference files before 'npm run build'."
      );
    });
  }
}

module.exports = CheckDllFilesWebpackPlugin;
