const readLine = require('readline-sync');
const { getCommandLineArgs } = require('./lib/cli');

const parserMap = new Map();
const manhwaParsers = require('./parsers');

const args = getCommandLineArgs(process.argv);
Object.keys(manhwaParsers).map((key) => {
  if (manhwaParsers[key].host !== undefined) {
    parserMap.set(manhwaParsers[key].host, manhwaParsers[key]);
  }
  return null;
});

let { url } = args;
const { all, amount } = args;

console.log('[PDF Manhwa]');

async function GetChapter(chapterUrl) {
  const host = new URL(chapterUrl).hostname;

  // ToLowerCase (maybe?)
  if(!parserMap.has(host)) {
    console.log(`ParserMap :: No Host: ${host}`);
    return;
  }

  try {
    parserMap.get(host).getChapter(chapterUrl, { all, amount });
  } catch(error) {
    console.error(error);
  }
}

if(url === undefined) url = readLine.question('Enter Chapter Url: ');
GetChapter(url);
