

module.exports = ({ timeLine }) => {
  timeLine = timeLine.onlyForDebug();

  return (content) => {
    const timeTrack = timeLine.startTrack('Html cut ng template script tags');

    const output = content.replace(/<script[^>]+text\/ng-template(?:.|[\n\r])+?<\/script>/ig, '');
    timeTrack.end();

    return output;
  }

};
