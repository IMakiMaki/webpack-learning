if (typeof window === 'undefined') {
  global.window = {};
}

const { renderMarkUp } = require('./utils');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/index-server');

const server = port => {
  const app = express();
  app.use(express.static('dist'));

  app.get('/server-side-render', (req, res) => {
    const html = renderMarkUp(renderToString([SSR]));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log('Server is running on port:' + port);
  });
};

server(process.env.PORT || 3000);
