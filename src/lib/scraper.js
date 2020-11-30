const { getHtml } = require('./scraperHelper');

async function scrape(chapterUrl, parser) {
  const html = await getHtml(chapterUrl);

  console.log(html);
  console.log(parser);

  return null;
}

module.exports = {
  scrape,
};
