const
  Context = require('./context')
  ;

module.exports = async ({
  verbose,
  hostname = '127.0.0.1',
  port = 17040,
  instances = Os.cpus().length * 2,
  debug,
  mongoDBUrl = 'mongodb://localhost:27017/icons8prerender',
  fileStorageDir = '../filestorage/data',
  noStorage
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

  await context.Icons8Prerender({
    hostname,
    port,
    instances,
    mongoDBUrl,
    fileStorageDir,
    noStorage
  });

};
