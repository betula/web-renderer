const
  Context = require('./context'),
  Os = require('os')
  ;

module.exports = async ({
  verbose,
  hostname = '127.0.0.1',
  port = 1704,
  appInstances = Os.cpus().length,
  initInstances = Os.cpus().length,
  apps = [],
  langs = [],
  initPage = 'not-found',
  debug,
  cmdKey
}) => {
  const context = Context();

  if (debug) {
    context.debugMode.enabled = true
  }

  context.logger.enabled = verbose;
  if (verbose) {
    context.logger.addDatePrefix();
    context.cluster.makeLoggerPrefix();
    context.logger.bindToStdStreams();
  }

  await context.Icons8Spa({
    hostname,
    port,
    appInstances,
    initInstances,
    apps,
    langs,
    initPage,
    cmdKey
  });

};
