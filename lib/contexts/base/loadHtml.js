
module.exports = ({ userAgent, timeLine, get }) => {

  return async (url) => {
    const timeTrack = timeLine.startTrack('Load html');

    const html = await get(url, {
      ['User-Agent']: userAgent.value
    });

    timeTrack.end();
    return html;
  }

};
