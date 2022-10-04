module.exports = {
  name: 'Webtoon',
  host: 'webtoon.xyz',
  url: 'https://webtoon.xyz/',
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
    return img.attribs['data-src'].trim();
  },
  getImagePadding(img) {
    return img.attribs.id;
  },
};
