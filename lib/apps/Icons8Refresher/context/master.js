
module.exports = ({ timeLine, ClusterBus, timeout, logger, metaPool, snapshotMetaStorage }) => {

  function run({ bus, instances, delay }) {

    for (let i = 0; i < instances; i++) {
      (async () => {
        for (;;) {
          const meta = await metaPool.get();
          if (!meta) {
            logger.error('Error: Meta from pool is null');
            break;
          }

          const { url } = meta;

          logger.text(`Refresh snapshot ${url}`);
          const timeTrack = timeLine.startTrack(`Refresh snapshot ${url}`);
          try {
            let status = await bus.send(url);
            logger.text(`Refresh:`, status, url);

          } catch (error) {
            logger.error(`Refresh error:`, url, error);
            await metaPool.failed(meta);
          }

          timeTrack.end();

          await timeout(delay);
        }
      })();
    }
  }

  return async ({ instances, delay, mongoDBUrl }) => {

    const timeTrack = timeLine.startTrack('Master init');
    const bus = await ClusterBus(instances);
    await snapshotMetaStorage.init(mongoDBUrl);
    timeTrack.end();

    run({ bus, instances, delay });

  }

};