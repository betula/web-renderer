const
  cluster = require('cluster')
;

module.exports = ({ logger }) => {

  const { isMaster, isWorker } = cluster;

  return {
    isMaster,
    isWorker,

    makeLoggerPrefix() {
      const prefix = isMaster ? 0 : cluster.worker.id;
      logger.addPrefix(prefix);
    }
  };

};