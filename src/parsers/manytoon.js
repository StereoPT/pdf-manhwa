module.exports = {
  name: 'ManyToon',
  host: 'manytoon.me',
  url: 'https://manytoon.me/',
  async getTitle($) {
    return $('#chapter-heading').text();
  },
  async getNextPage($) {
    return $('.next_page').first().attr('href');
  },
  async getImages($) {
    return $('.wp-manga-chapter-img');
  },
  getImageSrc(img) {
    return img.attribs.src.trim();
  },
  getImagePadding(img) {
    return img.attribs.id;
  },
};

// https://manytoon.me/manhwa/sweet-but-psycho-me0001/chapter-1/
