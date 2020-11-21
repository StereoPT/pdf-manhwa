const ora = require('ora');
const path = require('path');
const cheerio = require('cheerio');
const { generatePDF } = require('../lib/pdfHelper');
const { getHtml, downloadImage, getNextChapter } = require('../lib/scraperHelper');

async function scrapeChapter(chapterUrl, html) {
  let $ = cheerio.load(html);
  const mangaTitle = $('#chapter-heading').text().replace('\'', '').split(' ').join('_');
  let nextPage = $('.next_page').first().attr('href');

  console.log(` > Chapter: ${mangaTitle}`);
  const spinner = ora('Downloading...').start();

  const imagesPath = await scrapeChapterPart($, mangaTitle, spinner);

  await generatePDF(mangaTitle, imagesPath);

  getNextChapter(async () => {
    spinner.stopAndPersist();
    const html = await getHtml(nextPage);
    scrapeChapter(nextPage, html);
  });
}

async function scrapeChapterPart($, mangaTitle, spinner) {
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
  spinner.succeed("Downloaded!");

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

// https://toonily.com/webtoon/solmis-channel/chapter-9/