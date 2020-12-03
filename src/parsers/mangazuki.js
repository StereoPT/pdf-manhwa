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
  async getImages($) {
    return $('.wp-manga-chapter-img');
  },
  getImageSrc(img) {
    return img.attribs.src;
  },
  getImagePadding(img) {
    return img.attribs['data-image-paged'];
  },
};

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-2
