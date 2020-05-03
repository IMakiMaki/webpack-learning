const fs = require('fs');
const path = require('path');

module.exports.renderMarkUp = (str, name) => {
  const template = fs.readFileSync(path.join(__dirname, `../dist/${name}.html`), 'utf-8');
  return template.replace('<!--SERVER-SIDE-RENDER-HTML-PLACEHOLDER-->', str);
};
