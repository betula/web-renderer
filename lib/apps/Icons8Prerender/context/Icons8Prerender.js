
module.exports = ({ master, worker, logger, cluster }) => {

  return async (options) => {

    try {
      if (cluster.isMaster) {
        await master(options)
      }

      if (cluster.isWorker) {
        await worker(options);
      }

    } catch (error) {
      logger.error(error);
    }

  }

};
