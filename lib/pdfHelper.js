const fs = require('fs');
const path = require('path');
const wait = require('waait');
const PDFDocument = require('pdfkit');

async function generatePDF(pdfName, imagesPath) {
  const pdfDocument = new PDFDocument({ autoFirstPage: false });

  pdfName = pdfName.concat(".pdf");
  pdfDocument.pipe(fs.createWriteStream(path.join(__dirname, '..', pdfName)));

  for(let image of imagesPath) {
    let pdfImage = pdfDocument.openImage(image);
    pdfDocument.addPage({ size: [ pdfImage.width, pdfImage.height ] });
    pdfDocument.image(pdfImage, 0, 0);
    await wait(250);
  }

  pdfDocument.end();
}

module.exports = {
  generatePDF,
}