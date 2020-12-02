const path = require('path');
const { imagesFolder } = require('../config');
const { downloadImage } = require('../lib/scraperHelper');

module.exports = {
  name: 'Toonily',
  host: 'toonily.com',
  url: 'https://toonily.com/',
  async getTitle($) {
    return $('#chapter-heading').text();
  },
  async getNextPage($) {
    return $('.next_page').first().attr('href');
  },
  async scrapeChapterPart($, mangaTitle) {
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
  },
};

// https://toonily.com/webtoon/pheromone-holic-webtoon/chapter-27/
