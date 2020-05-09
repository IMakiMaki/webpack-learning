// 0.5.1版本的raw-loader
// 最新的 raw-loader 会有问题（因为它导出模块时是使用 export default）
// https://github.com/cpselvis/blog/issues/5
module.exports = function (content) {
  this.cacheable && this.cacheable();
  this.value = content;
  return 'module.exports = ' + JSON.stringify(content);
};
