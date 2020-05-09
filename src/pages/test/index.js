import React from 'react';
import ReactDOM from 'react-dom';
import icon from '@/images/icon.png';
import './index.less';
import '@/common/css/index.css';
import '@/common/css/index2.css';

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null,
    };
  }

  loadComponent() {
    import('./text.js').then((Text) => {
      this.setState({
        Text: Text.default,
      });
    });
  }

  render() {
    const { Text } = this.state;
    return (
      <div className="search-text">
        test.html
        <img alt="" onClick={() => this.loadComponent()} src={icon}></img>
        {Text && <Text></Text>}
      </div>
    );
  }
}

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(<Search></Search>, document.getElementById('root'));
