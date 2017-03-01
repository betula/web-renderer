

module.exports = ({ addMeta, extractStatusCode }) => {

  return ({ url, html, seconds }) => {

    const status = extractStatusCode(html);
    const date = new Date();

    html = addMeta(html, {
      url,
      status,
      date,
      seconds
    });

    return {
      url,
      html,
      status,
      date
    }
  }

};