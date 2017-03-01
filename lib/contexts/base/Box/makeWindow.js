const
  jsdom = require('jsdom')
  ;

module.exports = ({ timeout, userAgent, virtualConsole, resourceLoader, timeLine, debugMode }) => {

  function make({ html, url }) {
    const
      TIMEOUT = 2000;

    return new Promise((resolve, reject) => {

      const boxMakeTimeout = timeout(TIMEOUT, () => {
        reject(`Box make window timeout ${TIMEOUT}`);
      });

      [ resolve, reject ] = boxMakeTimeout.cancelDecorator([ resolve, reject ]);

      jsdom.env({
        html,
        url,
        userAgent: userAgent.value,
        cookie: debugMode.enabled ? '--digest-logger=' : '',
        virtualConsole,
        resourceLoader,
        features: {
          FetchExternalResources: [ 'script' ],
          ProcessExternalResources: [ 'script' ],
          SkipExternalResources: false
        },
        done: (err) => {
          if (err) return reject(err);
        },
        created: (err, window) => {
          if (err) return reject(err);
          resolve(window);
        }

      });
    })
  }

  return async ({ html, url }) => {

    const timeTrack = timeLine.startTrack('Box make window');
    const window = await make({ html, url });
    timeTrack.end();

    return window;
  }

};
