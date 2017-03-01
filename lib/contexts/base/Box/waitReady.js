

module.exports = ({ timeLine, timeout }) => {
  const
    READY_FLAG = 'prerenderReady'
  ;

  function wait(window) {
    const
      TIMEOUT = 10000;

    return new Promise((resolve, reject) => {
      let ready = false;

      const readyTimeout = timeout(TIMEOUT, () => {
        reject(`Box ready timeout ${TIMEOUT}`);
      });

      resolve = readyTimeout.cancelDecorator(resolve);

      delete window[READY_FLAG];
      Object.defineProperty(window, READY_FLAG, {
        get: () => ready,
        set: (v) => {
          if (ready = v) resolve()
        },
        configurable: true
      });

    })
  }

  return async (window) => {

    const timeTrack = timeLine.startTrack('Box wait ready');
    await wait(window);
    timeTrack.end();

  }

};
