

module.exports = ({ ClusterBus, resLine, Spa }) => {

  return async () => {
    const { appUrl, initPage } = ClusterBus.params;
    const url = appUrl + initPage;

    const resTrack = resLine.startTrack(`Worker ${appUrl} init ${url}`);
    const spa = await Spa(url);
    const bus = await ClusterBus();
    resTrack.end();

    bus.receiver(async (url) => {
      const resTrack = resLine.startTrack(`Worker ${appUrl} make snapshot`);
      const data = await spa.snapshot(url);

      resTrack.end();
      return data;
    });
  }

};