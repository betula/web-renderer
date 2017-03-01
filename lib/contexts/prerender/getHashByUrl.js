const
  crypto = require('crypto')
;

module.exports = () => {

  return (url) => {
    return crypto.createHash('sha256')
      .update(url)
      .digest('hex');
  }

};