const
  Context = require('context'),
  BaseContext = require('../base')
  ;

module.exports = () =>  {
  return Context(__dirname, BaseContext());
};
