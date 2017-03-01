

module.exports = () => {

  return ({ apps, langs }) => {
    const LANG_PLACEHOLDER = '{lang}';
    const list = [];

    langs = langs || [];

    for(let app of apps) {
      if (app.indexOf(LANG_PLACEHOLDER) != -1 && langs.length > 0) {
        for (let lang of langs) {
          list.push(app.replace(LANG_PLACEHOLDER, lang))
        }

      } else {
        list.push(app);
      }
    }

    return list;
  }

};