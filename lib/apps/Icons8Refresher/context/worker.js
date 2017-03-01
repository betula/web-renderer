

module.exports = ({ ClusterBus, resLine, Snapshot, snapshotStorage }) => {

  return async ({ mongoDBUrl, fileStorageDir }) => {

    const resTrack = resLine.startTrack(`Worker init`);
    await snapshotStorage.init({ mongoDBUrl, fileStorageDir });
    const bus = await ClusterBus();
    resTrack.end();

    bus.receiver(async (url) => {
      const resTrack = resLine.startTrack(`Worker perform snapshot`);

      let data = await Snapshot(url);
      await snapshotStorage.save(data);

      resTrack.end();
      return data.status;
    });
  }

};