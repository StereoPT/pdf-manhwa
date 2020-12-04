module.exports = {
  name: 'MangaClub',
  host: 'manhwa.club',
  url: 'https://manhwa.club/',
  async getTitle($) {
    return $('.reading-chapter-title').text();
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

// https://manhwa.club/manhwa/friends-girlfriend/chapter-1/
