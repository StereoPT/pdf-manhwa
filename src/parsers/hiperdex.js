module.exports = {
  name: 'Hiperdex',
  host: 'hiperdex.com',
  url: 'https://hiperdex.com/',
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

// https://hiperdex.com/manga/sweet-but-psycho/chapter-01/
