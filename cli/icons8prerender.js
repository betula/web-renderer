#!/usr/bin/env node --harmony

const
  chalk = require('chalk'),
  Icons8Prerender = require('../lib/apps/Icons8Prerender'),
  parseCliOptions = require('./lib/parseCliOptions'),
  exit = process.exit
;

const options = parseCliOptions({ verbose: true }, [
  'verbose',
  'hostname',
  'port',
  'instances',
  'debug',
  'noStorage',
  'mongoDBUrl',
  'fileStorageDir'
]);


Icons8Prerender(options).catch((err) => {
  console.error(err);
  console.log(chalk.red('ERROR!'));
  exit(1);
});
