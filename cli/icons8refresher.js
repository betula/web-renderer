#!/usr/bin/env node --harmony

const
  chalk = require('chalk'),
  Icons8Refresher = require('../lib/apps/Icons8Refresher'),
  parseCliOptions = require('./lib/parseCliOptions'),
  exit = process.exit
;

const options = parseCliOptions({ verbose: true }, [
  'verbose',
  'instances',
  'debug',
  'mongoDBUrl',
  'fileStorageDir',
  'delay'
]);


Icons8Refresher(options).catch((err) => {
  console.error(err);
  console.log(chalk.red('ERROR!'));
  exit(1);
});
