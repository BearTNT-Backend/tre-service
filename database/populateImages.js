const nodeFetch = require('node-fetch');
const unsplash = require('unsplash-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

global.fetch = nodeFetch;

const unsplashApi = unsplash.createApi({
  accessKey: '0UwLvwW_3dcG2Y96ePNo2hJQyCPo2_si9VA8YjYGQUA',
  // `fetch` options to be sent with every request
  headers: { 'X-Custom-Header': 'foo' },
});

const promises = [];

const seedPhotos = (number) => {
  const options = {
    query: 'cabin',
    page: number,
    perPage: 30,
  };
  return unsplashApi.search.getPhotos(options).then((results) => {
    const images = results.response.results;
    const imageLinks = images.map((image) => image.urls.full);
    return imageLinks;
  });
};

const downloadFromLink = (link, index) => {
  console.log(link, index);
  return new Promise((res, rej) => {
    https.get(link, (response) => {
      const file = fs.createWriteStream(path.resolve(__dirname, `./images/image${index}.jpg`));
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => res(response));
      }).on('error', (err) => {
        file.close(() => rej(err));
      });
      rej(response);
    });
  });
};

for (let i = 0; i < 33; i += 1) {
  promises.push(seedPhotos(i));
}

Promise.all(promises).then((data) => {
  console.log(JSON.stringify(data.flat().length));
  return data.flat();
}).catch((error) => {
  console.error(error);
}).then((links) => {
  const linkPromises = [];
  for (let i = 0; i < links.length; i += 1) {
    linkPromises.push(downloadFromLink(links[i], i));
  }
  Promise.all(linkPromises).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.error(error);
  });
});
