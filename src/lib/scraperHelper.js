const fs = require('fs');
const axios = require('axios');
const readLine = require('readline-sync');

async function getHtml(chapterUrl) {
  const { data: html } = await axios.get(chapterUrl);
  return html;
}

async function downloadImage(imgSrc, imgPath) {
  const response = await axios({ method: 'GET', url: imgSrc, responseType: 'stream' });
  
  response.data.pipe(fs.createWriteStream(imgPath));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });
    response.data.on('error', (e) => {
      reject(e);
    });
  });
}

function getNextChapter(callback) {
  const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
  if(nextChapter == 'Y') {
    return callback();  
  }
  
  console.log('[PDF Manhwa] Finished!');
}

module.exports = {
  getHtml,
  downloadImage,
  getNextChapter,
};