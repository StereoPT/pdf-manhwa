const fs = require('fs');
const path = require('path');
const { page } = require('pdfkit');
const PDFDocument = require('pdfkit');

async function generatePDF(pdfName, imagesPath) {
  const pdfDocument = new PDFDocument({
    autoFirstPage: false,
    info: { Author: 'StereoPT' },
  });

  pdfName = pdfName.concat(".pdf");
  let pageWidth = 0;
  let pageHeight = imagesPath.reduce((total, image) => {
    let img = pdfDocument.openImage(image);
    if(img.width >= pageWidth) pageWidth = Number(img.width);

    return total + pdfDocument.openImage(image).height; 
  }, 0);
  
  pdfDocument.pipe(fs.createWriteStream(path.join(__dirname, '..', pdfName)));
  pdfDocument.addPage({
    size: [ pageWidth, pageHeight ],
    margin: 0
  });

  for(let image of imagesPath) {
    let pdfImage = pdfDocument.openImage(image);
    pdfDocument.image(pdfImage, { align: 'center' });
  }

  pdfDocument.end();
}

/*async function generatePDF(pdfName, imagesPath) {
  const pdfDocument = new PDFDocument({
    autoFirstPage: false,
    bufferPages: true,
    info: { Author: 'StereoPT' }
  });

  pdfName = pdfName.concat(".pdf");
  pdfDocument.pipe(fs.createWriteStream(path.join(__dirname, '..', pdfName)));

  for(let image of imagesPath) {
    let pdfImage = pdfDocument.openImage(image);
    pdfDocument.addPage({ size: [ pdfImage.width, pdfImage.height ] });
    pdfDocument.image(pdfImage, 0, 0);
    pdfDocument.flushPages();
    await wait(250);
  }

  pdfDocument.end();
}*/

module.exports = {
  generatePDF,
}