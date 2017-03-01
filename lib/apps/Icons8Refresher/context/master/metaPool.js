

module.exports = ({ snapshotMetaStorage }) => {
  let
    cursor = null;

  function resetCursor() {
    cursor = snapshotMetaStorage.getCursorForOutdated();
  }

  return {

    async get() {
      if (!cursor) {
        resetCursor();
      }
      let meta = await cursor.next();

      if (!meta) {
        resetCursor();
        meta = await cursor.next();
      }

      return meta
    },

    async failed({ hash }) {
      await snapshotMetaStorage.markFailedByHash(hash)
    }

  }

};