const
  jsdom = require('jsdom')
;

module.exports = ({ makeWindow, decorateWindow, timeLine, waitReady, logger }) => {
  timeLine = timeLine.onlyForDebug();
  logger = logger.onlyForDebug();

  function changeUrl(window, url) {
    jsdom.changeURL(window, url);
    window.history.pushState({}, '', url); // may be for React
    if (window.angular) {
      window.angular.element(window.document).click(); // may be for Angular (calc custom? root element)
    }
  }

  return async ({ url, html }) => {

    const timeTrack = timeLine.startTrack('Box init');

    const window = await makeWindow({ url, html });
    decorateWindow(window);
    await waitReady(window);

    timeTrack.end();

    return {

      async changeUrl(url) {

        const timeTrack = timeLine.startTrack(`Box change url ${url}`);

        const boxUrl = window.location.href;
        const encodedUrl = encodeURI(url);

        if (url != boxUrl && encodedUrl != boxUrl) {
          const ready = waitReady(window);
          changeUrl(window, url);
          logger.text(`Box url changed ${window.location.href}`);
          await ready;
        }

        timeTrack.end();
      },

      getHtml() {
        return jsdom.serializeDocument(window.document)
      },

      close() {
        window.close();
      }

    }

  }

};
