const
  Http = require('http'),
  Https = require('https'),
  Url = require('url');

module.exports = ({ logger }) => {

  return (url, headers = {}) => {

    return new Promise((resolve, reject) => {

      function emErrHandler(em) {
        em.on('error', (error) => {
          logger.error(`Get ${url} error`, error);
          reject(`Got error: ${error.message}`);
        });
        return em;
      }

      const { protocol, hostname, port, path } = Url.parse(url);

      let options = {
        protocol,
        hostname,
        port,
        path,
        headers
      };

      const driver = ((protocol || '').indexOf('s') == -1) ? Http : Https;

      const req = driver.request(options, (res) => {
        const statusCode = res.statusCode;

        if (statusCode !== 200) {
          res.resume(); // consume response data to free up memory
          return reject(`Get ${url} Failed. Status Code: ${statusCode}`);
        }

        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', chunk => {
          rawData += chunk
        });
        res.on('end', () => {
          resolve(rawData);
        });

        emErrHandler(res);

      });

      emErrHandler(req);
      req.end()

    });

  };

};
