const
  Http = require('http'),
  Url = require('url')
  ;

module.exports = ({ logger, timeLine, Chan }) => {

  function run({ hostname, port }) {

    return new Promise((ok) => {
      const
        chan = Chan();

      const server = Http.createServer(async (req, res) => {
        const { url } = req;
        const parsedUrl = Url.parse(url, true);
        const { pathname, query } = parsedUrl;

        logger.text(`Server request ${url}`);

        const requestTimeTrack = timeLine.startTrack(`Server request ${url}`);

        if (pathname != '/') {
          res.statusCode = 400;
          logger.text('Server:', res.statusCode, url);
          res.end();

        } else {

          try {
            let
              status,
              html
            ;

            const processTimeTrack = timeLine.startTrack(`Process ${JSON.stringify(query)}`);
            const ret = await chan.send(query);
            processTimeTrack.end();

            if (typeof ret == 'number') {
              status = ret;

            } else {
              status = (ret || {}).status;
              html = (ret || {}).html;
            }

            status = status || 200;
            res.statusCode = status;

            if (html) {
              res.setHeader('Content-Type', 'text/html');
              res.end(html);

            } else {
              res.end();
            }

            logger.text('Server:', status, url);

          } catch (error) {
            res.statusCode = 500;
            logger.error('Server error:', res.statusCode, url, error);
            res.end();
          }
        }

        requestTimeTrack.end();
      });

      const handler = {
        chan: chan.readonly
      };

      server.listen(port, hostname, () => {
        logger.text(`Server running at http://${hostname}:${port}/`);
        ok(handler);
      });

    });

  }

  return async (options) => {

    const timeTrack = timeLine.startTrack('Server run');
    const server = await run(options);
    timeTrack.end();

    return server;

  }

};
