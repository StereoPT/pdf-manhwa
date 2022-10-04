module.exports = {
  name: 'ReadManhwa',
  host: 'readmanhwa.com',
  url: 'https://readmanhwa.com/',
  async getTitle($) {
    return $('.ccomic-title').text();
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

// https://readmanhwa.com/en/webtoon/sweet-but-psycho/chapter-1/reader/1
