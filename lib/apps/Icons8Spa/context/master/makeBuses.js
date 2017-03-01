

module.exports = ({ Chan, ClusterBus }) => {

  return async ({ appUrls, initPage, appInstances, initInstances }) => {
    const chan = Chan();
    const buses = {};

    for (let i = 0; i < initInstances; i++) {
      chan.receiver(async (appUrl) => {
        buses[appUrl] = await ClusterBus(appInstances, { appUrl, initPage });
      });
    }

    await Promise.all(appUrls.map((appUrl) => chan.send(appUrl)));
    return buses;
  }

};