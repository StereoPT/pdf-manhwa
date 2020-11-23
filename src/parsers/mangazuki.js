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
    const imgSrc = img.attribs.src;
    const imgPadding = img.attribs['data-image-paged'];
    const imgName = mangaTitle.concat('-', imgPadding, '.png');
    const imgPath = path.join(imagesFolder, imgName);

    imagesPath.push(imgPath);
    imagePromises.push(downloadImage(imgSrc, imgPath));
  });

  await Promise.all(imagePromises);

  return imagesPath;
}

async function scrapeChapter(chapterUrl, html) {
  let imagesPath = [];

  let $ = cheerio.load(html);
  const mangaTitle = createName($('meta[name="twitter:title"]').attr('content'));
  let nextPage;
  let searchNextPage;

  console.log(` > Chapter: ${mangaTitle}`);

  const downloadingSpinner = ora('Downloading...').start();
  do {
    nextPage = $('.next_page').first().attr('href');
    // eslint-disable-next-line prefer-destructuring
    searchNextPage = nextPage.split('?')[0];

    const chapterPartImagePaths = await scrapeChapterPart($, mangaTitle);
    imagesPath = imagesPath.concat(chapterPartImagePaths);

    const nextPartHtml = await getHtml(nextPage);
    $ = cheerio.load(nextPartHtml);
  } while(chapterUrl.search(searchNextPage) !== -1);
  downloadingSpinner.succeed('Downloaded!');

  const generatingSpinner = ora('Generating...').start();
  const pdfName = chapterUrl.split('/').pop();
  await generatePDF(pdfName, imagesPath);
  generatingSpinner.succeed('Generated!');

  await removeImages(imagesPath);

  getNextChapter(async () => {
    const nextPageHtml = await getHtml(nextPage);
    scrapeChapter(nextPage, nextPageHtml);
  });
}

module.exports = {
  name: 'Mangazuki',
  host: 'mangazuki.me',
  url: 'https://mangazuki.me/',
  async getChapter(chapterUrl) {
    const html = await getHtml(chapterUrl);
    await scrapeChapter(chapterUrl, html);
  },
};

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-1
