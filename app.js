const readLine = require('readline-sync');
const axios = require('axios');
const cheerio = require('cheerio');

const parserMap = new Map();
const manhwaParsers = require('./parsers');

Object.keys(manhwaParsers).map((key) => {
  if(manhwaParsers[key].host !== undefined) {
    parserMap.set(manhwaParsers[key].host, manhwaParsers[key]);
  }
});

console.log('[PDF Manhwa]');

async function GetChapter(URL) {
  const { request, data: html } = await axios.get(URL);
  const { host } = request;

  // ToLowerCase (maybe?)
  if(!parserMap.has(host)) {
    console.log('ParserMap :: No Host: ' + host);
    return;
  }

  try {
    parserMap.get(host).parse(cheerio, html, URL);
  } catch(error) {
    console.error(error);
  }
}

const chapterUrl = readLine.question('Enter Chapter Url: ');
GetChapter(chapterUrl);
