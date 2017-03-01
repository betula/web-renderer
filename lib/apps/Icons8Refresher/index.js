const
  Context = require('./context')
  ;

module.exports = async ({
  verbose,
  instances = 1,
  debug,
  mongoDBUrl = 'mongodb://localhost:27017/icons8prerender',
  fileStorageDir = '../filestorage/data',
  delay
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

  await context.Icons8Refresher({
    instances,
    mongoDBUrl,
    fileStorageDir,
    delay
  });

};
