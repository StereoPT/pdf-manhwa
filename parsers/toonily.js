const fs = require('fs');
const readLine = require('readline-sync');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { downloadImage } = require('../lib/imageHelper');
const PDFDocument = require('pdfkit');
const wait = require('waait');

async function scrapeChapter(chapterUrl, html) {
  const chapterDoc = new PDFDocument({ autoFirstPage: false });

  let $ = cheerio.load(html);
  const mangaTitle = $('#chapter-heading').text().replace('\'', '').split(' ').join('_');
  let nextPage = $('.next_page').first().attr('href');

  const imagesPath = await scrapeChapterPart($, mangaTitle);

  chapterDoc.pipe(fs.createWriteStream(path.join(__dirname, '..', `${mangaTitle}.pdf`)));
  
  for(let image of imagesPath) {
    let pdfImage = chapterDoc.openImage(image);
    chapterDoc.addPage({ size: [ pdfImage.width, pdfImage.height ] });
    chapterDoc.image(pdfImage, 0, 0);
    await wait(100);
  }

  chapterDoc.end();

  const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
  if(nextChapter == 'Y') {
    console.log(` > Next Chapter: ${nextPage}`);
    const { data: html } = await axios.get(nextPage);
    scrapeChapter(nextPage, html);
  }
}

async function scrapeChapterPart($, mangaTitle) {
  let imagePromises = [];
  let imagesPath = [];

  const imageObject = $('.wp-manga-chapter-img');

  imageObject.each(async function(index, img) {
    const imgSrc = img.attribs['data-src'].trim();
    const imgPadding = img.attribs.id;
    const imgName = mangaTitle + "-" + imgPadding + ".png";
    const imgPath = path.join(__dirname, '..', 'images', imgName);

    imagesPath.push(imgPath);
    imagePromises.push(downloadImage(imgSrc, imgPath));
  });

  await Promise.all(imagePromises);
  await wait(500);

  return imagesPath;
}

module.exports = {
  name: 'Toonily',
  host: 'toonily.com',
  url: 'https://toonily.com/',
  async getChapter(chapterUrl, html) {
    await scrapeChapter(chapterUrl, html);
  }
}

// https://toonily.com/webtoon/solmis-channel/chapter-1/