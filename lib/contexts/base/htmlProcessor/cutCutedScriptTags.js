

module.exports = ({ timeLine }) => {
  timeLine = timeLine.onlyForDebug();

  return (content) => {
    const timeTrack = timeLine.startTrack('Html cut cuted script tags');

    const output = content.replace(/(<script[^>]+)(data-web-renderer="cut")((?:.|[\n\r])+?<\/script>)/ig, '');
    timeTrack.end();

    return output;
  }

};
