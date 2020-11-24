const yargs = require('yargs');

const getCommandLineArgs = (processArgv) => yargs(processArgv)
  .usage('Usage: -u <manhwa url>')
  .option({
    u: {
      alias: 'url',
      demandOption: false,
      describe: 'URL to Manhwa Chapter',
      type: 'string',
    },
  }).argv;

module.exports = {
  getCommandLineArgs,
};
