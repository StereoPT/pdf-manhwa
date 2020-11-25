const yargs = require('yargs');

const getCommandLineArgs = (processArgv) => yargs(processArgv)
  .usage('Usage: $0 <cmd> [args]')
  .option({
    u: {
      alias: 'url',
      demandOption: false,
      describe: 'URL to Manhwa Chapter',
      type: 'string',
    },
    a: {
      alias: 'all',
      demandOption: false,
      describe: 'Download All Chapters',
      type: 'boolean',
      default: false,
    },
    n: {
      alias: 'amount',
      demandOption: false,
      describe: 'Amount of Chapters to Download',
      type: 'integer',
    },
    o: {
      alias: 'output',
      demandOption: false,
      describe: 'PDF Output Location',
      type: 'string',
    },
  }).argv;

module.exports = {
  getCommandLineArgs,
};
