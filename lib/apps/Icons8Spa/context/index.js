const
  Context = require('context'),
  BaseContext = require('../../../contexts/base')
  ;

module.exports = () =>  {
  return Context(__dirname, BaseContext());
};
