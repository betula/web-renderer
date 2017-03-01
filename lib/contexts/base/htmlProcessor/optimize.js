const
  parse5 = require('parse5')
  ;

module.exports = ({ timeLine, logger }) => {
  timeLine = timeLine.onlyForDebug();
  logger = logger.onlyForDebug();

  let
    parser,
    output
    ;

  function init() {
    parser = new parse5.SimpleApiParser({

      doctype(name, publicId, systemId) {
        output += '<!DOCTYPE '
          + name
          + (publicId ? ' PUBLIC "' + publicId + '"' : '')
          + (!publicId && systemId ? ' SYSTEM' : '')
          + (systemId ? ' "' + systemId + '"' : '')
          + '>';
      },

      startTag(tag, attrs, unary) {
        let
          attr,
          prefix;

        output += '<' + tag;

        for (attr of attrs) {
          prefix = attr.name.slice(0, 3);
          if (prefix == 'ng-' || prefix == 'i8-') continue;

          output += ' ' + attr.name + '="' + attr.value + '"';
        }

        output += (unary ? '/' : '') + '>';
      },

      endTag(tag) {
        output += '</' + tag + '>';
      },

      text(text) {
        output += text;
      },

      comment(text) {
        // remove comments
      }
    }, {
      decodeHtmlEntities: false
    });
  }

  function optimize(content) {
    output = '';
    parser.parse(content);
    return output
  }

  init();

  return (content) => {

    const timeTrack = timeLine.startTrack('Html optimize');
    const output = optimize(content);
    timeTrack.end();

    logger.text(`From ${(content.length/1024).toFixed(2)} Kb to ${(output.length/1024).toFixed(2)} Kb`);

    return output;
  };

};
