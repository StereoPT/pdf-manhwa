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
      describe: 'Download all Chapters',
      type: 'boolean',
      default: false,
    },
  }).argv;

module.exports = {
  getCommandLineArgs,
};
