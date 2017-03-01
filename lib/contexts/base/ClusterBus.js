const
  cluster = require('cluster'),
  os = require('os'),
  env = process.env;

module.exports = ({ Chan, logger, timeLine, timeout }) => {
  const
    SYSTEM_MESSAGE_KEY = '__$$system_message$$__',
    READY_MESSAGE = 'ready',
    MESSAGE_FAIL_MESSAGE = 'message_fail',
    WORKER_PARAMS_ENV_KEY = 'CLUSTER_BUS_WORKER_PARAMS';

  function _packSystemMessage(type, data) {
    return {
      [SYSTEM_MESSAGE_KEY]: {
        type,
        data
      }
    }
  }

  function _extractSystemMessage(message) {
    return (message || {})[SYSTEM_MESSAGE_KEY];
  }

  function worker() {
    const chan = Chan();

    process.on('message', async (value) => {
      const timeTrack = timeLine.startTrack(`Bus worker ${cluster.worker.id} ${cluster.worker.process.pid} receive message ${JSON.stringify(value)}`);

      logger.text(`Bus worker ${cluster.worker.id} ${cluster.worker.process.pid} process message ${JSON.stringify(value)}`);
      try {
        const reply = await chan.send(value);
        process.send(reply);
      }
      catch (error) {
        logger.error(`Bus worker ${cluster.worker.id} ${cluster.worker.process.pid} error`, error);
        timeLine.abortNonFinishedTracks();
        process.send(_packSystemMessage(MESSAGE_FAIL_MESSAGE, `${error}`));
      }

      timeTrack.end();
    });

    process.send(_packSystemMessage(READY_MESSAGE));

    return chan.readonly;
  }

  async function master(cap, workerParams) {
    cap = cap || os.cpus().length;

    const
      REMAKE_PAUSE = 5000,
      chan = Chan(),
      remakeQueue = Chan();

    let
      workerEnv = null;

    if (workerParams) {
      workerEnv = {
        [WORKER_PARAMS_ENV_KEY]: JSON.stringify(workerParams)
      }
    }

    function make() {
      const
        READY_TIMEOUT = 15000,
        REPLY_TIMEOUT = 15000;

      return new Promise((ok, fail) => {
        const worker = cluster.fork(workerEnv);

        let
          detached = false,
          workerSendReject,
          workerSenderDetach,
          workerSendResolve;

        const readyTimeTrack = timeLine.startTrack(`Bus worker ${worker.id} ${worker.process.pid} ready`);

        const readyTimeout = timeout(READY_TIMEOUT, () => {
          logger.error(`Bus worker ${worker.id} ${worker.process.pid} ready timeout ${READY_TIMEOUT}`);
          fail();
        });

        [ ok, fail ] = readyTimeout.cancelDecorator([ ok, fail ]);

        function _workerAttach() {
          workerSenderDetach = chan.receiver(async (value) => {
            logger.text(`Bus worker ${worker.id} ${worker.process.pid} send message ${JSON.stringify(value)}`);

            if (detached) {
              await Promise.reject();
            }

            const replyTimeout = timeout(REPLY_TIMEOUT, () => {
              logger.error(`Bus worker ${worker.id} ${worker.process.pid} reply timeout ${REPLY_TIMEOUT}`);
              _workerKill()
            });

            const replyPromise = new Promise((resolve, reject) => {
              [ workerSendResolve, workerSendReject ] = replyTimeout.cancelDecorator([ resolve, reject ]);
            });

            worker.send(value);
            return await replyPromise
          });
        }

        function _workerKill() {
          logger.alert(`Bus worker ${worker.id} kill`);
          _workerDetach();
          worker.kill();
        }

        function _workerDetach() {
          detached = true;
          workerSenderDetach && workerSenderDetach();
          workerSendReject && workerSendReject();
        }

        worker.on('message', (message) => {
          const systemMessage = _extractSystemMessage(message);
          if (!systemMessage) {
            workerSendResolve(message);
            return;
          }

          switch(systemMessage.type) {
            case READY_MESSAGE:
              _workerAttach();
              readyTimeTrack.end();
              ok(worker);
              break;

            case MESSAGE_FAIL_MESSAGE:
              workerSendReject(systemMessage.data);
              _workerKill();
              break;
          }

        });

        worker.on('disconnect', () => {
          logger.error(`Bus worker ${worker.id} ${worker.process.pid} has disconnected`);
          _workerDetach();
          fail();
        });

        worker.on('error', (error) => {
          logger.error(`Bus worker ${worker.id} ${worker.process.pid} error`, error);
          _workerDetach();
          fail();
        });

      });
    }

    const timeTrack = timeLine.startTrack(`Bus master ${process.pid} ready`);

    for (let i = 0; i < cap; i++) {
      try {
        let worker = await make();
        worker.on('disconnect', () => {
          remakeQueue.send();
        });

      } catch (e) {
        await timeout(REMAKE_PAUSE);
        remakeQueue.send();
      }
    }

    timeTrack.end();

    remakeQueue.receiver(async () => {
      try {
        let worker = await make();
        worker.on('disconnect', () => {
          remakeQueue.send();
        });

      } catch (e) {
        await timeout(REMAKE_PAUSE);
        remakeQueue.send();
      }
    });

    return chan;
  }

  function workerParamsAssignTo(obj) {
    const params = env[WORKER_PARAMS_ENV_KEY];
    if (params) {
      obj.params = JSON.parse(params);
    }
  }

  async function bus(cap, workerParams) {

    if (cluster.isMaster) {
      return await master(cap, workerParams);
    }

    if (cluster.isWorker) {
      return worker();
    }

  }

  if (cluster.isWorker) {
    workerParamsAssignTo(bus)
  }

  return bus

};
