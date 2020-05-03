if (typeof window === 'undefined') {
  global.window = {};
}
const express = require('express');
const { renderToString } = require('react-dom/server');
const { renderMarkUp } = require('./utils');
const SSR = require('../dist/index-server');

const server = port => {
  const app = express();
  app.use(express.static('dist'));

  app.get('/server-side-render', (req, res) => {
    const html = renderMarkUp(renderToString([SSR]), 'index');
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log('Server is running on port:' + port);
  });
};

server(process.env.PORT || 3000);
