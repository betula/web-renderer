

module.exports = ({ timeLine, logger }) => {
  timeLine = timeLine.onlyForDebug();
  logger = logger.onlyForDebug();

  return (html) => {
    const timeTrack = timeLine.startTrack('Html expand raw html blocks');

    let count = 0;

    html = html.replace(/<!--\[RAWHTML\[((?:.|[\n\r])+?)]]-->/ig, (_, match) => {
      count ++;
      return match;
    });

    logger.text(`Raw html blocks expanded ${count}`);

    timeTrack.end();
    return html;
  }

};
