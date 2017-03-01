const
  Context = require('context'),
  PrerenderContext = require('../../../contexts/prerender')
  ;

module.exports = () =>  {
  return Context(__dirname, PrerenderContext());
};
