const
  MongoClient = require('mongodb').MongoClient
;

module.exports = ({ timeLine }) => {
  const
    COLLECTION_NAME = 'snapshots'
    ;

  let
    db,
    collection
    ;

  return {

    async init(mongoDBUrl) {
      const timeTrack = timeLine.startTrack('Meta storage init');
      db = await MongoClient.connect(mongoDBUrl);
      collection = db.collection(COLLECTION_NAME);

      await collection.createIndex({ hash: 1 }, { unique:true, w:1 });
      await collection.createIndex({ date: 1 }, { background:true, w:1 });

      timeTrack.end();
    },

    async getByHash(hash) {
      const timeTrack = timeLine.startTrack('Meta storage get');
      const data = await collection.findOne({ hash });
      timeTrack.end();
      return data;
    },

    async saveByHash(hash, { url, status, date }) {
      const timeTrack = timeLine.startTrack('Meta storage save');
      const doc = {
        hash,
        url,
        status,
        date,
        error: 0
      };
      const data = await collection.updateOne({ hash }, doc, { upsert:true, w:1 });
      timeTrack.end();
      return data;
    },

    async removeByHash(hash) {
      const timeTrack = timeLine.startTrack('Meta storage remove');
      const data = await collection.deleteOne({ hash }, { w:1 });
      timeTrack.end();
      return data;
    },

    getCursorForOutdated() {
      const cursor = collection.find().sort({ date: 1 });
      return {
        async next() {
          return await cursor.nextObject();
        }
      }
    },

    async markFailedByHash(hash) {
      const timeTrack = timeLine.startTrack('Meta storage mark failed');
      await collection.findOneAndUpdate({ hash }, { $inc: { error: 1 }});
      timeTrack.end();
    }

  }

};