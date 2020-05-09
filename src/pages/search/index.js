import React from 'react';
import ReactDOM from 'react-dom';
import { two } from '@/common/js/someUtil.js';
import icon from '@/images/icon.png';
import './index.less';
import '@/common/css/index.css';
import '@/common/css/index2.css';

class Search extends React.Component {
  render() {
    return (
      <div className="search-text">
        Search Test{two()}
        <img src={icon} alt=""></img>
      </div>
    );
  }
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Search></Search>, document.getElementById('root'));
