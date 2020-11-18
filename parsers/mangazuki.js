const fs = require('fs');
const readLine = require('readline-sync');
const axios = require('axios');
const path = require('path');
const { downloadImage } = require('../lib/imageHelper');
const PDFDocument = require('pdfkit');
const wait = require('waait');

module.exports = {
  name: 'Mangazuki',
  host: 'mangazuki.me',
  url: 'https://mangazuki.me/',
  async parse(cheerio, html, chapterUrl) {
    const chapterDoc = new PDFDocument({ autoFirstPage: false });
    let imagePromises = [];
    let imagesPath = [];

    const $ = cheerio.load(html);
    const mangaTitle = $('meta[name="twitter:title"]').attr('content').split(' ').join('_');
    const imageObject = $('.wp-manga-chapter-img');
    let nextPage = $('.next_page').first().attr('href');

    imageObject.each(async function(index, img) {
      const imgSrc = img.attribs.src;
      const imgPadding = img.attribs['data-image-paged'];
      const imgName = mangaTitle + "-" + imgPadding + ".png";
      const imgPath = path.join(__dirname, '..', 'images', imgName);

      imagesPath.push(imgPath);
      imagePromises.push(downloadImage(imgSrc, imgPath));
    });

    Promise.all(imagePromises).then(async () => {
      chapterDoc.pipe(fs.createWriteStream(path.join(__dirname, '..', `${chapterUrl.split('/').pop()}.pdf`)));
      for(let image of imagesPath) {
        let pdfImage = chapterDoc.openImage(image);
        chapterDoc.addPage({ size: [ pdfImage.width, pdfImage.height ] });
        chapterDoc.image(pdfImage, 0, 0);
      }
      chapterDoc.end();

      let searchNextPage = nextPage.split('?')[0];
      if(chapterUrl.search(searchNextPage) == -1) {
        const nextChapter = readLine.question('Download Next Chapter [Y/N]: ').toUpperCase();
        if(nextChapter == 'Y') {
          console.log(` > NextPage: ${nextPage}`);
          const { data: html } = await axios.get(nextPage);
          this.parse(cheerio, html, nextPage);
        }
      } else {
        console.log(` > NextPage: ${nextPage}`);
        const { data: html } = await axios.get(nextPage);
        this.parse(cheerio, html, nextPage);
      }
    });
  }
}

// https://mangazuki.me/manga/unwanted-roommate-manga-funch-online/unwanted-roommate-1