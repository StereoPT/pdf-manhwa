const ora = require('ora');
const path = require('path');
const cheerio = require('cheerio');
const { imagesFolder } = require('../config');
const { generatePDF } = require('../lib/pdfHelper');
const {
  getHtml, downloadImage, removeImages, getNextChapter, createName,
} = require('../lib/scraperHelper');

async function scrapeChapterPart($, mangaTitle) {
  const imagePromises = [];
  const imagesPath = [];

  const imageObject = $('.wp-manga-chapter-img');

  imageObject.each((index, img) => {
    const imgSrc = img.attribs['data-src'].trim();
    const imgPadding = img.attribs.id;
    const imgName = mangaTitle.concat('-', imgPadding, '.png');
    const imgPath = path.join(imagesFolder(), imgName);

    imagesPath.push(imgPath);
    imagePromises.push(downloadImage(imgSrc, imgPath));
  });

  await Promise.all(imagePromises);

  return imagesPath;
}

async function scrapeChapter(chapterUrl, html, args) {
  const { all, amount, output } = args;

  if(amount <= 0) {
    console.log('[PDF Manhwa] Finished!');
    return;
  }

  const $ = cheerio.load(html);
  const mangaTitle = createName($('#chapter-heading').text());
  const nextPage = $('.next_page').first().attr('href');

  console.log(` > Chapter: ${mangaTitle}`);

  const downloadingSpinner = ora('Downloading...').start();
  const imagesPath = await scrapeChapterPart($, mangaTitle);
  downloadingSpinner.succeed('Downloaded!');

  const generatingSpinner = ora('Generating...').start();
  await generatePDF(mangaTitle, imagesPath, output);
  generatingSpinner.succeed('Generated!');

  await removeImages(imagesPath);
  console.log('');

  if(all === false && amount === undefined) {
    getNextChapter(() => downloadNextChapter(nextPage, args));
  } else {
    // Download All Chapters
    const newArgs = { ...args };
    if(amount !== undefined) {
      newArgs.amount = amount - 1;
    }
    await downloadNextChapter(nextPage, newArgs);
  }
}

async function downloadNextChapter(nextPage, args) {
  const nextPageHtml = await getHtml(nextPage);
  scrapeChapter(nextPage, nextPageHtml, args);
}

module.exports = {
  name: 'Toonily',
  host: 'toonily.com',
  url: 'https://toonily.com/',
  async getChapter(chapterUrl, args) {
    const html = await getHtml(chapterUrl);
    await scrapeChapter(chapterUrl, html, args);
  },
};

// https://toonily.com/webtoon/pheromone-holic-webtoon/chapter-6/
