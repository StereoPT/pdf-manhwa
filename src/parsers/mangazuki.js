const path = require('path');
const { imagesFolder } = require('../config');
const { downloadImage } = require('../lib/scraperHelper');

module.exports = {
  name: 'Mangazuki',
  host: 'mangazuki.me',
  url: 'https://mangazuki.me/',
  async getTitle($) {
    // May Lead to Errors!
    return $('meta[name="keywords"]').attr('content').split(',')[1].trim().toLowerCase();
  },
  async getNextPage($) {
    return $('.next_page').first().attr('href');
  },
  async scrapeChapterPart($, mangaTitle) {
    const imagePromises = [];
    const imagesPath = [];

    const imageObject = $('.wp-manga-chapter-img');

    imageObject.each((index, img) => {
      const imgSrc = img.attribs.src;
      const imgPadding = img.attribs['data-image-paged'];
      const imgName = mangaTitle.concat('-', imgPadding, '.png');
      const imgPath = path.join(imagesFolder(), imgName);

      imagesPath.push(imgPath);
      imagePromises.push(downloadImage(imgSrc, imgPath));
    });

    await Promise.all(imagePromises);
    return imagesPath;
  },
};

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-2
