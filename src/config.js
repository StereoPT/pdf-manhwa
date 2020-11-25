const os = require('os');
const fs = require('fs');
const path = require('path');

const imagesFolder = () => {
  let imagesDir = path.join(__dirname, '..', 'images');

  if(!fs.existsSync(imagesDir)) imagesDir = os.tmpdir();

  return imagesDir;
};

const pdfsFolder = () => {
  const pdfsDir = path.join(__dirname, '..', 'pdfs');

  if(!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir);

  return pdfsDir;
};

module.exports = {
  imagesFolder,
  pdfsFolder,
};
