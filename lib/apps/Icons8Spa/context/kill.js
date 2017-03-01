const
  exit = process.exit,
  nextTick = process.nextTick
;

module.exports = ({ logger }) => {

  return () => {
    logger.alert('Start killing');
    nextTick(() => {
      logger.alert('Kill');
      exit();
    });
  }

};