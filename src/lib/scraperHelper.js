const fs = require('fs');
const axios = require('axios');
const readLine = require('readline-sync');
const sanitizeFilename = require('sanitize-filename');

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

async function removeImages(imagesPath) {
  // eslint-disable-next-line no-restricted-syntax
  for(const image of imagesPath) {
    fs.unlinkSync(image);
  }
}

function getNextChapter(callback) {
  console.log('');
  const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
  if(nextChapter === 'Y') {
    return callback();
  }

  return console.log('[PDF Manhwa] Finished!');
}

function createName(htmlText) {
  const name = sanitizeFilename(htmlText);
  console.log(name);
  return name;
}

module.exports = {
  getHtml,
  downloadImage,
  removeImages,
  getNextChapter,
  createName,
};