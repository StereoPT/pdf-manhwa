const cheerio = require('cheerio');
const path = require('path');
const { getHtml, downloadImage, getNextChapter } = require('../lib/scraperHelper');
const { generatePDF } = require('../lib/pdfHelper');
const wait = require('waait');

async function scrapeChapter(chapterUrl, html) {
  let imagesPath = [];

  let $ = cheerio.load(html);
  const mangaTitle = $('meta[name="twitter:title"]').attr('content').split(' ').join('_');
  let nextPage, searchNextPage;

  do {
    nextPage = $('.next_page').first().attr('href');
    console.log(` > Next Part: ${nextPage}`);
    searchNextPage = nextPage.split('?')[0];

    const chapterPartImagePaths = await scrapeChapterPart($, mangaTitle);
    imagesPath = imagesPath.concat(chapterPartImagePaths);
  
    const html = await getHtml(nextPage);
    $ = cheerio.load(html);
    await wait(500);
  } while(chapterUrl.search(searchNextPage) != -1);

  const pdfName = chapterUrl.split('/').pop();
  await generatePDF(pdfName, imagesPath);
  await wait(250);

  getNextChapter(async () => {
    console.log(` > Next Chapter: ${nextPage}`);
    const html = await getHtml(nextPage);
    scrapeChapter(nextPage, html);
  });  
}

async function scrapeChapterPart($, mangaTitle) {
  let imagePromises = [];
  let imagesPath = [];

  const imageObject = $('.wp-manga-chapter-img');

  imageObject.each(function(index, img) {
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
  async getChapter(chapterUrl) {
    const html = await getHtml(chapterUrl);
    await scrapeChapter(chapterUrl, html);
  }
}

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-1