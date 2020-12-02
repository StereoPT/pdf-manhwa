const ora = require('ora');
const cheerio = require('cheerio');
const sanitizeFilename = require('sanitize-filename');
const { generatePDF } = require('./pdfHelper');
const { getHtml, removeImages, getNextChapter } = require('./scraperHelper');

async function scrapeChapterParts(parser, $, manhwaTitle, currentUrl) {
  let imagesPath = [];
  let $$ = $;
  let nextPageUrl;

  do {
    const chapterImagesPath = await parser.scrapeChapterPart($$, manhwaTitle);
    imagesPath = [...imagesPath, ...chapterImagesPath];

    nextPageUrl = await parser.getNextPage($$);

    if(nextPageUrl.search(currentUrl) === 0) {
      const html = await getHtml(nextPageUrl);
      $$ = cheerio.load(html);
    }
  } while(nextPageUrl.search(currentUrl) === 0);

  return {
    imagesPath,
    nextPageUrl,
  };
}

// Maybe this will be a Recursive Function!
async function scrapeChapter(chapterUrl, parser, args) {
  const { all, amount, output } = args;

  // Check if we have any Chapter to Download
  if(amount <= 0) {
    console.log('[PDF Manhwa] Finished!');
    return;
  }

  // Download & Load the Page HTML
  const html = await getHtml(chapterUrl);
  const $ = cheerio.load(html);

  const manhwaTitle = sanitizeFilename(await parser.getTitle($));

  console.log(` > Chapter: ${manhwaTitle}`);

  // Scrape Chapter Part
  const downloadingSpinner = ora('Downloading...').start();
  const { imagesPath, nextPageUrl } = await scrapeChapterParts(parser, $, manhwaTitle, chapterUrl);
  downloadingSpinner.succeed('Downloaded!');

  // Generate PDF
  const generatingSpinner = ora('Generating...').start();
  await generatePDF(manhwaTitle, imagesPath, output);
  generatingSpinner.succeed('Generated!');

  // Remove Images
  const removingSpinner = ora('Removing...').start();
  await removeImages(imagesPath);
  removingSpinner.succeed('Removed!');

  if(all === false && amount === undefined) {
    getNextChapter(() => scrapeChapter(nextPageUrl, parser, args));
  } else {
    // Download All Chapters
    const newArgs = { ...args };
    if(amount !== undefined) {
      newArgs.amount = amount - 1;
    }
    await scrapeChapter(nextPageUrl, parser, newArgs);
  }
}

module.exports = {
  scrapeChapter,
};
