

module.exports = ({ timeLine, Server, ClusterBus }) => {

  return async ({ hostname, port, instances }) => {

    const timeTrack = timeLine.startTrack('Master init');

    const server = await Server({ hostname, port });
    const bus = await ClusterBus(instances);

    server.chan.forward(async ({ url }) => {
      return await bus.send(url)
    });

    timeTrack.end();
  }

};