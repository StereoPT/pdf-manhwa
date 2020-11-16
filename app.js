const axios = require('axios');
const parserMap = new Map();
const manhwaParsers = require('./parsers');

Object.keys(manhwaParsers).map((key) => {
  parserMap.set(manhwaParsers[key].name, manhwaParsers[key]);
});

console.log('[PDF Manhwa]');

async function GetSiteHTML() {
  const URL = 'http://www.google.com/';
  const { data: html } = await axios.get(URL);

  console.log(html);
}

GetSiteHTML();
