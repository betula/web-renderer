const
  chalk = require('chalk'),
  stdout = process.stdout,
  stderr = process.stderr
;

module.exports = ({ Line, debugMode, noop }) => {
  const
    COLORS = {
      alert: 'red',
      text: 'default',
      textLabel: 'green',
      prefix: 'gray',
      errorLog: 'red'
    },
    logLine = Line(),
    errorLogLine = Line()
  ;

  const
    PREFIX_SEPARATOR = toColor('prefix', '|')
  ;

  let
    enabled = true,
    prefixes = []
  ;

  function toColor(name, text) {
    const color = COLORS[name];
    if (color == 'default') {
      return text
    }
    return chalk[color](text);
  }

  function toText(values, colorName) {
    const len = values.length;

    values = values.map((value, index) => {
      if (value instanceof Error) {
        let text = value.message + '\n' + value.stack;
        if (index < len - 1) {
          text += '\n'
        }
        return text;
      } else {
        return value;
      }
    });

    const text = values.join(' ');
    return colorName ? toColor(colorName, text) : text;
  }

  function addPrefix(val) {
    const prefix = {};
    if (typeof val == 'function') {
      prefix.fn = val

    } else {
      prefix.str = val
    }
    prefixes.push(prefix);

    return () => {
      prefixes = prefixes.filter(v => v != prefix);
    }
  }

  function getFullPrefix() {
    let str = '';
    for (let prefix of prefixes) {
      if (prefix.fn) {
        str += prefix.fn()
      } else {
        str += prefix.str
      }
      str += PREFIX_SEPARATOR
    }
    return str;
  }

  function logLineTextFinalFormatter(text) {
    return getFullPrefix() + text + '\n';
  }

  function sendToLogLine(values, colorName = null) {
    logLine.send(logLineTextFinalFormatter(toText(values, colorName)));
  }

  function sendToErrorLogLine(values) {
    errorLogLine.send(logLineTextFinalFormatter(toText(values)));
  }

  const
    mockLogger = {
      text: noop,
      alert: noop,
      error: noop
    }
  ;


  return {

    set enabled(val) {
      enabled = val
    },

    addDatePrefix() {
      return addPrefix(() => {
        const d = new Date();

        function format(val) {
          val = String(val);
          return (val.length < 2) ? '0' + val : val
        }

        return toColor('prefix',
          format(d.getUTCMonth() + 1) +
          format(d.getUTCDate()) +
          '.' +
          format(d.getUTCHours()) +
          format(d.getUTCMinutes()) +
          format(d.getUTCSeconds())
        );
      })
    },

    addPrefix(val) {
      return addPrefix(toColor('prefix', val));
    },

    textWithLabel(label, ...values) {
      if (!enabled) return;
      sendToLogLine([
        toColor('textLabel', `${label}:`),
        toText(values, 'text')
      ]);
    },

    errorWithLabel(label, ...values) {
      this.error(`${label}:`, ...values);
    },

    text(...values) {
      if (!enabled) return;
      sendToLogLine(values, 'text');
    },

    alert(...values) {
      if (!enabled) return;
      sendToLogLine(values, 'alert');
    },

    error(...values) {
      if (!enabled) return;
      const text = toText(values);
      sendToLogLine([text], 'alert');
      sendToErrorLogLine([text]);
    },

    lines: {
      log: logLine.readonly,
      error: errorLogLine.readonly
    },

    bindToStdStreams() {
      logLine.receiver((text) => {
        stdout.write(text);
      });

      errorLogLine.receiver((text) => {
        stderr.write(toColor('errorLog', text));
      });
    },

    onlyForDebug() {
      if (debugMode.enabled) {
        return this
      }
      return mockLogger
    }

  };

};
