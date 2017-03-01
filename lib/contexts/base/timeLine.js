

module.exports = ({ logger, debugMode, noop }) => {
  const
    getHrtime = process.hrtime
  ;

  let
    registeredTracks = []
  ;

  function sec(seconds) {
    return seconds.toFixed(3) + ' sec'
  }

  function registerTrack(track) {
    registeredTracks.push(track);
    return () => {
      registeredTracks = registeredTracks.filter(v => v != track);
    }
  }

  function abortAllRegisteredTracks() {
    const tracks = registeredTracks.reverse();
    for(let track of tracks) {
      track.abort();
    }
  }

  const
    mockTrack = {
      end: noop
    },
    mockTimeLine = {
      startTrack: () => mockTrack
    };


  return {

    startTrack(mark) {
      const start = getHrtime();
      let seconds;
      let finished = false;

      function finish() {
        if (!finished) {
          const diff = getHrtime(start);
          seconds = diff[0] + diff[1] / 1e9;
          finished = true;
        }
      }

      const unRegisterTrack = registerTrack({
        abort
      });

      function end() {
        if (!finished) {
          unRegisterTrack();
          finish();
          if (mark) {
            logger.textWithLabel(`Time (${mark})`, sec(seconds));
          }
        }

        return seconds
      }

      function abort() {
        if (!finished) {
          unRegisterTrack();
          finish();
          if (mark) {
            logger.errorWithLabel(`Abort time track (${mark})`, sec(seconds));
          }
        }
      }

      return {
        end,
        get seconds() {
          return seconds
        }
      }
    },

    abortNonFinishedTracks() {
      abortAllRegisteredTracks()
    },

    onlyForDebug() {
      if (debugMode.enabled) {
        return this
      }
      return mockTimeLine
    }


  };

};