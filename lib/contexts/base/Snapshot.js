
module.exports = ({ timeLine, Box, htmlProcessor, loadHtml, makeSnapshotObject }) => {

  return async (url) => {

    const timeTrack = timeLine.startTrack('Snapshot');

    let html = await loadHtml(url);
    html = htmlProcessor.prepare(html);

    const box = await Box({ url, html });
    html = box.getHtml();
    box.close();

    html = htmlProcessor.perform(html);

    timeTrack.end();

    const { seconds } = timeTrack;
    return makeSnapshotObject({ url, html, seconds });

  }

};
