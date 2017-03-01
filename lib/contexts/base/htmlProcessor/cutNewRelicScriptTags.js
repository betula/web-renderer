

module.exports = ({ timeLine }) => {
  timeLine = timeLine.onlyForDebug();

  return (content) => {
    const timeTrack = timeLine.startTrack('Html cut new relic script tags');

    const output = content.replace(/<script[^>]*>window.NREUM(?:.|[\n\r])*?<\/script>/ig, '');

    timeTrack.end();

    return output;
  }

};
