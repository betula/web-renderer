const
  jsdom = require('jsdom')
;

module.exports = ({ console }) => {
  const virtualConsole = jsdom.createVirtualConsole();

  virtualConsole.sendTo(console);
  return virtualConsole;
};