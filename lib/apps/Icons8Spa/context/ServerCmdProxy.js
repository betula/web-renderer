

module.exports = ({ logger, kill, Chan }) => {

  return (server, { locked = false, cmdKey }) => {
    const
      chan = Chan();

    function setLocked(value = true) {
      if (locked == value) {
        return
      }
      locked = value;
      if (locked) {
        logger.text('Server locked');
      } else {
        logger.text('Server unlocked');
      }
    }

    if (locked) {
      logger.text('Server locked');
    }

    server.chan.forward(async (query) => {

      const { key, cmd } = query;

      if (key || cmd) {
        if (cmdKey && cmdKey === key) {
          logger.text('Server cmd:', cmd);

          switch(cmd) {

            case 'lock':
              setLocked();
              return;

            case 'unlock':
              setLocked(false);
              return;

            case 'kill':
              setLocked();
              kill();
              return;

          }
        }

        logger.error(`Server malformed cmd: ${cmd}, key: ${key}`);
        return 400
      }


      if (locked) {
        logger.error('Server locked:', JSON.stringify(query));
        return 503
      }

      return await chan.send(query);
    });

    return {
      chan: chan.readonly,

      set locked(value) {
        setLocked(value);
      }
    }

  }

};