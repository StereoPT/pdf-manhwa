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
  async getImages($) {
    return $('.wp-manga-chapter-img');
  },
  async getImageSrc(img) {
    return img.attribs['data-src'].trim();
  },
  async getImagePadding(img) {
    return img.attribs.id;
  },
};

// https://toonily.com/webtoon/pheromone-holic-webtoon/chapter-28/
