const yargs = require('yargs');

const getCommandLineArgs = (processArgv) => yargs(processArgv)
  .usage('Usage:\n'
    + ' -u <manhwa chapter url>\n'
    + ' -a <download all chapters>')
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
      default: 1,
    },
  }).argv;

module.exports = {
  getCommandLineArgs,
};
