const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'Mangazuki',
  host: 'mangazuki.me',
  url: 'https://mangazuki.me/',
  async parse(axios, cheerio, html) {
    const $ = cheerio.load(html);
    const mangaTitle = $('meta[name="twitter:title"]').attr('content').split(' ').join('_');
    const imageObject = $('.wp-manga-chapter-img');
    
    const images = imageObject.map((index, img) => {
      const imgSrc = img.attribs.src;
      const imgName = mangaTitle + "-" + index + ".jpg";
      const imgPath = path.join(__dirname, '..', 'images', imgName);

      axios({ url: imgSrc, responseType: 'stream' }).then((response) => {
        new Promise((resolve, reject) => {
          response.data.pipe(fs.createWriteStream(imgPath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
        });
      });
      
      return img.attribs.src;
    });
  }
}