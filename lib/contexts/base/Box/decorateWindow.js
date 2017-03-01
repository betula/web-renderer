const
  localStorage = require('localstorage-memory'),
  xhrSymbols = require('jsdom/lib/jsdom/living/xmlhttprequest-symbols'),
  hrtime = process.hrtime
  ;

module.exports = ({ logger, timeLine }) => {

  function XMLHttpRequestDecorate(XMLHttpRequest) {
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function(...args) {
      const
        flag = this[xhrSymbols.flag],
        uri = flag.uri
        ;

      logger.text('Box XMLHttpRequest:', uri);

      const timeTrack = timeLine.startTrack(`=> ${uri}`);

      [ 'load', 'error', 'abort' ].forEach((type) => {
        this.addEventListener(type, () => {
          timeTrack.end();
        });
      });

      return send.apply(this, args);
    };
  }

  function addMatchMedia(window) {
    window.matchMedia = () => {
      return {}
    };
  }

  function addSessionAndLocalStorage(window) {
    for (let key of [ 'sessionStorage', 'localStorage' ]) {
      window[key] = localStorage
    }
  }


  const timeOrigin = hrtime();

  function addPerformance(window) {
    window.performance = {
      now() {
        const diff = hrtime(timeOrigin);
        return diff[0] * 1e3 + diff[1] / 1e6
      }
    }
  }

  return (window) => {

    addMatchMedia(window);
    addPerformance(window);
    addSessionAndLocalStorage(window);
    XMLHttpRequestDecorate(window.XMLHttpRequest);

  }

};
