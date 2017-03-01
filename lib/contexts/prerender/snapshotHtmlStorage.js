const
  Path = require('path'),
  mkdirp = require('mkdirp'),
  Fs = require('fs')
  ;

module.exports = ({ timeLine }) => {
  const
    FILE_EXT = '.html',
    FILE_ENCODING = 'utf8'
  ;

  let
    root
  ;

  function init(dir) {
    root = Path.resolve(dir);
    return makeDir(root);
  }

  function makeDir(dir) {
    return new Promise((ok, fail) => {
      mkdirp(dir, (err) => {
        if (err) {
          fail(err);
        } else {
          ok();
        }
      })
    })
  }

  function getDirByHash(hash) {
    return Path.join(
      root,
      hash.slice(0, 2),
      hash.slice(2, 4)
    )
  }

  function getFilePathByHash(hash) {
    return Path.join(
      getDirByHash(hash),
      hash + FILE_EXT
    )
  }

  function isFileAvailableToReadByHash(hash) {
    return new Promise((ok) => {
      Fs.access(getFilePathByHash(hash), Fs.constants.R_OK, (err) => {
        ok( !err );
      });
    });
  }

  function readFileByHash(hash) {
    return new Promise((ok, fail) => {
      Fs.readFile(getFilePathByHash(hash), FILE_ENCODING, (err, html) => {
        if (err) {
          fail(err)
        } else {
          ok(html)
        }
      });
    });
  }

  function writeFileByHash(hash, html) {
    return new Promise((ok, fail) => {
      Fs.writeFile(getFilePathByHash(hash), html, FILE_ENCODING, (err) => {
        if (err) {
          fail(err)
        } else {
          ok()
        }
      });
    });
  }

  return {

    async init(fileStorageDir) {
      const timeTrack = timeLine.startTrack('Html storage init');
      await init(fileStorageDir);
      timeTrack.end();
    },

    async getByHash(hash) {
      const timeTrack = timeLine.startTrack('Html storage get');
      let html;
      if (await isFileAvailableToReadByHash(hash)) {
        html = await readFileByHash(hash);
      }
      timeTrack.end();
      return html;
    },

    async saveByHash(hash, html) {
      const timeTrack = timeLine.startTrack('Html storage save');
      await makeDir(getDirByHash(hash));
      await writeFileByHash(hash, html);
      timeTrack.end();
    }

  }

};