import React from 'react';
import ReactDOM from 'react-dom';
import icon from '@/images/icon.png';
import { two } from '@/common/js/someUtil.js';
import test from '@/common/js/once';
import '@/common/css/index.css';
import '@/common/css/index2.css';
import largeNumber from 'large-number-yh-test';

class Index extends React.Component {
  render() {
    return (
      <div className="test">
        这里是一个div节测试用{two()} +++
        {largeNumber('12213213121321212', '1222222222221212212211212211121122')}
        {test()}
        <img alt="" src={icon}></img>
        <div className="test2">测试节点</div>
      </div>
    );
  }
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Index></Index>, document.getElementById('root'));
