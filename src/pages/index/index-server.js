const icon = require('@/images/icon.png').default;
const largeNumber = require('large-number-yh-test');
const React = require('react');
require('@/common/css/index.css');
require('@/common/css/index2.css');

class Index extends React.Component {
  render() {
    return (
      <div className="test">
        这里是一个div节测试用 +++
        {largeNumber('12213213121321212', '1222222222221212212211212211121122')}
        <img alt="" src={icon}></img>
        <div className="test2">测试节点</div>
      </div>
    );
  }
}

module.exports = <Index />;
