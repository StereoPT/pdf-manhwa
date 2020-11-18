const fs = require('fs');
const axios = require('axios');

async function downloadImage(imgSrc, imgPath) {
  await axios({ url: imgSrc, responseType: 'stream' }).then((response) => {
    new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(imgPath))
        .on('finish', () => resolve())
        .on('error', e => reject(e));
    });
  });
}

module.exports = {
  downloadImage,
};