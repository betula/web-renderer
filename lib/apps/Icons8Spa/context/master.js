
module.exports = ({ timeLine, Server, resolveAppUrls, makeBuses, ServerCmdProxy }) => {

  return async ({ hostname, port, appInstances, initInstances, apps, langs, initPage, cmdKey }) => {

    const timeTrack = timeLine.startTrack('Master init');

    const server = await Server({ hostname, port });
    const serverCmdProxy = ServerCmdProxy(server, { locked: true, cmdKey });

    const appUrls = resolveAppUrls({ apps, langs });
    const buses = await makeBuses({ appInstances, initInstances, appUrls, initPage });

    serverCmdProxy.locked = false;
    serverCmdProxy.chan.forward(async ({ url }) => {

      for (let appUrl of appUrls) {
        if (url.slice(0, appUrl.length) === appUrl) {
          return await buses[appUrl].send(url);
        }
      }

      return 404
    });

    timeTrack.end();
  }

};