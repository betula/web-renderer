

module.exports = ({ snapshotMetaStorage, snapshotHtmlStorage, getHashByUrl }) => {


  return {

    async init({ mongoDBUrl, fileStorageDir }) {
      await snapshotMetaStorage.init(mongoDBUrl);
      await snapshotHtmlStorage.init(fileStorageDir);
    },

    async get(url) {
      const hash = getHashByUrl(url);
      const meta = await snapshotMetaStorage.getByHash(hash);

      if (!meta) {
        return null
      }

      const { status } = meta;
      const html = await snapshotHtmlStorage.getByHash(hash);

      if (!html) {
        await snapshotMetaStorage.removeByHash(hash);
        return null
      }

      return {
        html,
        status
      }
    },

    async save({ url, status, html, date }) {
      const hash = getHashByUrl(url);
      await snapshotHtmlStorage.saveByHash(hash, html);
      await snapshotMetaStorage.saveByHash(hash, { url, status, date });
    }

  }

};
