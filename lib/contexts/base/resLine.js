

module.exports = ({ logger, OnceFn }) => {
  const
    getHrtime = process.hrtime,
    getMemoryUsage = process.memoryUsage,
    getCpuUsage = process.cpuUsage;

  function hrTimeToMs(hrTime) {
    return hrTime[0] * 1000 + hrTime[1] / 1e6
  }

  function mb(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' Mb'
  }

  function sec(ms) {
    return (ms / 1000).toFixed(3) + ' sec'
  }

  function percent(fraction) {
    return (100 * fraction).toFixed(1) + '%';
  }

  function time(start) {
    let diff = getHrtime(start);
    return sec(hrTimeToMs(diff));
  }

  function mem(start) {
    let curr = getMemoryUsage();
    return mb(start.rss) + ' -> ' + mb(curr.rss)
  }

  function cpu(startCpu, startTime) {
    const diffMs = hrTimeToMs(getHrtime(startTime));
    const diffCpu = getCpuUsage(startCpu);
    return percent((diffCpu.user + diffCpu.system) / 1000 / diffMs)
  }

  return {

    startTrack(mark) {
      const startTime = getHrtime();
      const startCpu = getCpuUsage();
      const startMem = getMemoryUsage();

      return {
        end: OnceFn(() => {

          logger.textWithLabel(
            `Resource (${mark})`,
            `time: ${time(startTime)},`,
            `mem: ${mem(startMem)},`,
            `cpu: ${cpu(startCpu, startTime)}`
          );
        })
      }
    }

  };

};