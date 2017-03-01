
const
  Fs = require('fs'),
  Path = require('path'),
  exit = process.exit,
  argv = process.argv
  ;

module.exports = (defaults, params) => {
  const appFileName = argv[1];
  const configFileName = argv[2];

  if (!configFileName) {
    console.log(`Usage: node --harmony ${Path.basename(appFileName)} config.json`);
    exit();
  }

  const options = Object.assign({}, defaults);

  if (configFileName) {
    const config = JSON.parse(Fs.readFileSync(Path.resolve(configFileName)));
    for (let param of params) {
      if (config.hasOwnProperty(param)) {
        options[param] = config[param];
      }
    }
  }

  return options
};