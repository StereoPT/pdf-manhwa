const readLine = require('readline-sync');

const parserMap = new Map();
const manhwaParsers = require('./parsers');

Object.keys(manhwaParsers).map((key) => {
  if (manhwaParsers[key].host !== undefined) {
    parserMap.set(manhwaParsers[key].host, manhwaParsers[key]);
  }
});

console.log('[PDF Manhwa]');

async function GetChapter(chapterUrl) {
  const host = new URL(chapterUrl).hostname;

  // ToLowerCase (maybe?)
  if (!parserMap.has(host)) {
    console.log(`ParserMap :: No Host: ${host}`);
    return;
  }

  try {
    parserMap.get(host).getChapter(chapterUrl);
  } catch (error) {
    console.error(error);
  }
}

const chapterUrl = readLine.question('Enter Chapter Url: ');
GetChapter(chapterUrl);
