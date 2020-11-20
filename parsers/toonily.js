const cheerio = require('cheerio');
const path = require('path');
const { getHtml, downloadImage, getNextChapter } = require('../lib/scraperHelper');
const { generatePDF } = require('../lib/pdfHelper');
const wait = require('waait');

async function scrapeChapter(chapterUrl, html) {
  let $ = cheerio.load(html);
  const mangaTitle = $('#chapter-heading').text().replace('\'', '').split(' ').join('_');
  let nextPage = $('.next_page').first().attr('href');

  const imagesPath = await scrapeChapterPart($, mangaTitle);

  await generatePDF(mangaTitle, imagesPath);
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
  async getChapter(chapterUrl) {
    const html = await getHtml(chapterUrl);
    await scrapeChapter(chapterUrl, html);
  }
}

// https://toonily.com/webtoon/solmis-channel/chapter-4/