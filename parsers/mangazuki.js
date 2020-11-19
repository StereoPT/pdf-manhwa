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
  let imagesPath = [];

  let $ = cheerio.load(html);
  const mangaTitle = $('meta[name="twitter:title"]').attr('content').split(' ').join('_');
  let nextPage, searchNextPage;

  do {
    nextPage = $('.next_page').first().attr('href');
    console.log(` > NextPage: ${nextPage}`);
    searchNextPage = nextPage.split('?')[0];
    
    const chapterPartImagePaths = await scrapeChapterPart($, mangaTitle);
    imagesPath = imagesPath.concat(chapterPartImagePaths);
  
    const { data: html } = await axios.get(nextPage);
    $ = cheerio.load(html);
  } while(chapterUrl.search(searchNextPage) != -1);

  chapterDoc.pipe(fs.createWriteStream(path.join(__dirname, '..', `${chapterUrl.split('/').pop()}.pdf`)));
  
  for(let image of imagesPath) {
    let pdfImage = chapterDoc.openImage(image);
    chapterDoc.addPage({ size: [ pdfImage.width, pdfImage.height ] });
    chapterDoc.image(pdfImage, 0, 0);
  }

  chapterDoc.end();

  const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
  if(nextChapter == 'Y') {
    console.log(` > NextPage: ${nextPage}`);
    const { data: html } = await axios.get(nextPage);
    this.scrapeChapter(nextPage, html);
  }
}

async function scrapeChapterPart($, mangaTitle) {
  let imagePromises = [];
  let imagesPath = [];

  const imageObject = $('.wp-manga-chapter-img');

  imageObject.each(async function(index, img) {
    const imgSrc = img.attribs.src;
    const imgPadding = img.attribs['data-image-paged'];
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
  name: 'Mangazuki',
  host: 'mangazuki.me',
  url: 'https://mangazuki.me/',
  async getChapter(chapterUrl, html) {
    await scrapeChapter(chapterUrl, html);
  }
}

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-1