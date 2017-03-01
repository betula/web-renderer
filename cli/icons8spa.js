#!/usr/bin/env node --harmony

const
  chalk = require('chalk'),
  Icons8Spa = require('../lib/apps/Icons8Spa'),
  parseCliOptions = require('./lib/parseCliOptions'),
  exit = process.exit
;

const options = parseCliOptions({ verbose: true }, [
  'verbose',
  'hostname',
  'port',
  'appInstances',
  'initInstances',
  'apps',
  'langs',
  'initPage',
  'debug',
  'cmdKey'
]);


Icons8Spa(options).catch((err) => {
  console.error(err);
  console.log(chalk.red('ERROR!'));
  exit(1);
});
