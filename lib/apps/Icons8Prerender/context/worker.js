

module.exports = ({ ClusterBus, resLine, Snapshot, snapshotStorage }) => {

  return async ({ mongoDBUrl, fileStorageDir, noStorage }) => {

    const resTrack = resLine.startTrack(`Worker init`);
    if (!noStorage) {
      await snapshotStorage.init({ mongoDBUrl, fileStorageDir });
    }
    const bus = await ClusterBus();
    resTrack.end();

    bus.receiver(async (url) => {
      const resTrack = resLine.startTrack(`Worker perform snapshot`);
      let data;
      if (!noStorage) {
        data = await snapshotStorage.get(url);
      }
      if (!data) {
        data = await Snapshot(url);
        if (!noStorage) {
          await snapshotStorage.save(data);
        }
      }

      resTrack.end();
      return data;
    });
  }

};