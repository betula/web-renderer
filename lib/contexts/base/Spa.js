
module.exports = ({ timeLine, Box, htmlProcessor, loadHtml, makeSnapshotObject, debugMode }) => {

  return async (url) => {

    const timeTrack = timeLine.startTrack('Spa make');

    let html = await loadHtml(url);
    html = htmlProcessor.prepare(html);

    const box = await Box({ url, html });

    timeTrack.end();

    return {

      async snapshot(url) {

        const timeTrack = timeLine.startTrack('Spa snapshot');

        await box.changeUrl(url);
        let html = box.getHtml();

        html = htmlProcessor.perform(html);

        timeTrack.end();

        const { seconds } = timeTrack;
        return makeSnapshotObject({ url, html, seconds });

      },

      close() {
        box.close();
      }

    }

  }

};
