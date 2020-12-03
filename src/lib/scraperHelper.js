const fs = require('fs');
const axios = require('axios');
const readLine = require('readline-sync');

async function getHtml(chapterUrl) {
  try {
    const { data: html } = await axios.get(chapterUrl);
    return html;
  } catch(error) {
    const { response } = error;
    const { request, ...errorObject } = response;
    throw new Error(errorObject);
  }
}

async function downloadImage(imgSrc, imgPath) {
  try {
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
  } catch(error) {
    throw new Error(error);
  }
}

async function removeImages(imagesPath) {
  // eslint-disable-next-line no-restricted-syntax
  for(const image of imagesPath) {
    fs.unlinkSync(image);
  }
}

function getNextChapter(callback) {
  const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
  if(nextChapter === 'Y') {
    return callback();
  }

  return console.log('[PDF Manhwa] Finished!');
}

module.exports = {
  getHtml,
  downloadImage,
  removeImages,
  getNextChapter,
};
