const
  nextTick = process.nextTick
;

module.exports = ({ logger, timeLine }) => {
  const
    cache = {};

  return (resource, callback) => {
    let
      url = resource.url.href;

    if (cache[url]) {
      logger.text('Box resource cache:', url);
      nextTick(() => {
        callback(null, cache[url]);
      });

    } else {
      logger.text('Box resource load:', url);

      const timeTrack = timeLine.startTrack(`-> ${url}`);
      resource.defaultFetch((err, body) => {
        timeTrack.end();
        if (err) {
          logger.error(`Box resource ${url} error`, err);

        } else {
          cache[url] = body;
        }
        callback(err, body);
      });
    }
  }

};