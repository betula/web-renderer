const
  chalk = require('chalk')
;

module.exports = ({ logger }) => {
  const
    COLORS = {
      log: 'grey',
      info: 'green',
      warn: 'yellow',
      debug: 'blue',
      error: 'red'
    },
    console = {};

  [ 'info', 'warn', 'error', 'log', 'debug' ].forEach((type) => {

    console[type] = (...values) => {
      const color = COLORS[type];

      let method = (type == 'error') ? 'error' : 'text';
      logger[method](chalk[color](`*[${type}]:`), ...values);
    };

  });

  return console;
};