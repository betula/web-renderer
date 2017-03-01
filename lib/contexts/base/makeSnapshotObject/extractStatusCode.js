

module.exports = ({ timeLine }) => {
  timeLine = timeLine.onlyForDebug();

  return (html) => {

    const timeTrack = timeLine.startTrack('Html extract status code');

    let code = null;
    let match = /<meta[^>]+?prerender-status-code[^>]*>/i.exec(html);
    if (match) {
      match = /content['"\s=]+([0-9]+)/i.exec(match[0]);
      if (match) {
        code = parseInt(match[1]) || null;
      }
    }

    timeTrack.end();

    return code;
  }

};
