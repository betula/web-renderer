

module.exports = ({ timeLine }) => {
  timeLine = timeLine.onlyForDebug();

  return {

    collapse(html) {

      const timeTrack = timeLine.startTrack('Html collapse ignored script tags');

      html = html.replace(/(<script[^>]+)(data-web-renderer="ignore")((?:.|[\n\r])+?<\/script>)/ig, (match, m1, m2, m3) => {
        return '<!--[IGNORED[' + m1 + m3 + ']]-->'
      });

      timeTrack.end();
      return html;
    },

    expand(html) {
      const timeTrack = timeLine.startTrack('Html expand ignored script tags');

      html = html.replace(/<!--\[IGNORED\[((?:.|[\n\r])+?)]]-->/ig, '$1');

      timeTrack.end();
      return html;
    }

  };

};
