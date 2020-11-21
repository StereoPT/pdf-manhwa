const ora = require('ora');
const path = require('path');
const cheerio = require('cheerio');
const { generatePDF } = require('../lib/pdfHelper');
const { getHtml, downloadImage, getNextChapter } = require('../lib/scraperHelper');

async function scrapeChapter(chapterUrl, html) {
  let imagesPath = [];
  
  let $ = cheerio.load(html);
  const mangaTitle = $('meta[name="twitter:title"]').attr('content').split(' ').join('_');
  let nextPage, searchNextPage;
  
  console.log(` > Chapter: ${mangaTitle}`);
  const spinner = ora('Downloading...').start();

  do {
    nextPage = $('.next_page').first().attr('href');
    searchNextPage = nextPage.split('?')[0];

    const chapterPartImagePaths = await scrapeChapterPart($, mangaTitle);
    imagesPath = imagesPath.concat(chapterPartImagePaths);
  
    const html = await getHtml(nextPage);
    $ = cheerio.load(html);
  } while(chapterUrl.search(searchNextPage) != -1);
  spinner.succeed("Downloaded!");

  const pdfName = chapterUrl.split('/').pop();
  await generatePDF(pdfName, imagesPath);

  getNextChapter(async () => {
    spinner.stopAndPersist();
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
    const imgPath = path.join(__dirname, '..', '..', 'images', imgName);

    imagesPath.push(imgPath);
    imagePromises.push(downloadImage(imgSrc, imgPath));
  });

  await Promise.all(imagePromises);  

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