const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { pdfsFolder } = require('../config');

async function generatePDF(pdfName, imagesPath) {
  const pdfDocument = new PDFDocument({
    autoFirstPage: false,
    info: { Author: 'StereoPT' },
  });

  const actualPdfName = pdfName.concat('.pdf');
  let pageWidth = 0;
  const pageHeight = imagesPath.reduce((total, image) => {
    const img = pdfDocument.openImage(image);
    if(img.width >= pageWidth) pageWidth = Number(img.width);

    return total + pdfDocument.openImage(image).height;
  }, 0);

  pdfDocument.pipe(fs.createWriteStream(path.join(pdfsFolder, actualPdfName)));
  pdfDocument.addPage({
    size: [pageWidth, pageHeight],
    margin: 0,
  });

  // eslint-disable-next-line no-restricted-syntax
  for(const image of imagesPath) {
    const pdfImage = pdfDocument.openImage(image);
    pdfDocument.image(pdfImage, { align: 'center' });
  }

  pdfDocument.end();
}

module.exports = {
  generatePDF,
};
