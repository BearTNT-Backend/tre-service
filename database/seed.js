/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
// write my data creator here
// const mongoose = require('mongoose');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
// random number between two values
AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));
// process.setMaxListeners(0);
const getRandomNum = (min, max) => {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
};

const makeRandomRating = () => {
  const num = getRandomNum(3, 6);
  if (num === 5) {
    return num;
  }
  const dec1 = getRandomNum(1, 10);
  const dec2 = getRandomNum(1, 10);

  const rating = parseFloat(`${num}.${dec1}${dec2}`);
  return rating;
};
// =========== arrays that will hold dummy data to generate random data objects ============

// write an array of listing names
const names = ['Cabin in the woods', 'Grandma\'s cozy cottage', 'Mountain escape', 'Hut on a hill', 'Forest-side cabin', 'Luxurious time away in the woods', 'Crazy mountain container casa', '"The Burrow"', 'Beautiful Home in Scenic Area', 'Lovely Vacation Home in the Great Outdoors', 'Smokey\'s Sleepy Cave', 'The Lodge', 'Glamping is Happiness Home', 'Secluded Private Wilderness Home'];

const s3 = new AWS.S3();
const writer = fs.createWriteStream(path.resolve(__dirname, './data.csv'), { flags: 'a' });
writer.setMaxListeners(1);
// write a function that will pull about 8-15 photos and put them in an array

const getPhotos = async () => {
  try {
    let photoList = await s3.listObjectsV2({ Bucket: 'tre-sdc-images' }).promise();
    const prefix = 'https://tre-sdc-images.s3.amazonaws.com/';
    photoList = photoList.Contents.map((image, i) => {
      const url = prefix + image.Key;
      const description = faker.lorem.sentence();
      const photoId = i;
      return {
        url,
        description,
        photoId,
      };
    });
    return photoList;
  } catch (error) {
    console.error(error);
    return (error);
  }
};

// const randomPhotoGrouper = (photos, x) => {
//   // create a result array of photos and descriptions
//   const photoGroup = [];
//   let i = 0;
//   // let id = 1;
//   while (i < x) {
//     const index = getRandomNum(0, photos.length);
//     const photoObj = photos[index];
//     // photoObj.photoId = id;
//     photoGroup.push(photoObj);
//     i += 1;
//     // id += 1;
//   }
//   return photoGroup;
// };
const record = {
  sharedId: 0,
  name: '',
  rating: 0,
  reviews: 0,
  location: '',
};
const entry = {
  sharedId: 0,
  name: '',
  rating: 0,
  reviews: 0,
  location: '',
  photoId: 0,
  description: '',
  url: '',
};
// need to write function(s) that will build 100 data objects
// const writeListings = (i, numPhotos, photos) => {
//   let ind = i;
//   const numberPhotos = numPhotos;
//   const photosUsed = photos;
//   function createPhotosListings() {
//     let ok = true;
//     while (ind < numberPhotos && ok) {
//       ind += 1;
//       const photo = photosUsed[getRandomNum(0, photos.length - 1)];
//       entry.sharedId = record.sharedId;
//       entry.name = record.name;
//       entry.rating = record.rating;
//       entry.reviews = record.reviews;
//       entry.location = record.location;
//       entry.photoId = photo.photoId;
//       entry.description = photo.description;
//       entry.url = photo.url;
//       if (i === numberPhotos) {
//         writer.write(`${entry.sharedId}|${entry.name}|${entry.rating}|${entry.reviews}|
//         ${entry.location}|${entry.photoId}|${entry.description}|${entry.url}\n`);
//       } else {
//         ok = writer.write(`${entry.sharedId}|${entry.name}|${entry.rating}|${entry.reviews}|
//                        ${entry.location}|${entry.photoId}|${entry.description}|${entry.url}\n`);
//       }
//       console.log(numberPhotos, ind, ok);
//     }
//     if (i < numPhotos && ok === false) {
//       console.log('Reached this place');
//       writer.once('drain', createPhotosListings);
//     }
//   }
//   createPhotosListings();
// };
const listingMaker = (index, newRecord, leftOverPhotoIndex, photos, numberOfPhotos = null) => {
  // this will push a single data object
  for (let i = index; i < 10000000; i += 1) {
    if (newRecord) {
      record.sharedId = i;
      record.name = names[getRandomNum(0, names.length)];
      record.rating = makeRandomRating();
      record.reviews = getRandomNum(4, 80);
      record.location = `${faker.address.city()}, ${faker.address.state()}, ${faker.address.country()}`;
    }
    const numPhotos = numberOfPhotos || getRandomNum(5, 8);
    let ok = true;
    let remainder = 0;
    for (let j = leftOverPhotoIndex; j <= numPhotos; j += 1) {
      const photo = photos[getRandomNum(0, photos.length - 1)];
      entry.sharedId = record.sharedId;
      entry.name = record.name;
      entry.rating = record.rating;
      entry.reviews = record.reviews;
      entry.location = record.location;
      entry.photoId = photo.photoId;
      entry.description = photo.description;
      entry.url = photo.url;
      if (j === numPhotos) {
        writer.write(`${entry.sharedId}|${entry.name}|${entry.rating}|${entry.reviews}|${entry.location}|${entry.photoId}|${entry.description}|${entry.url}\n`);
      } else {
        ok = writer.write(`${entry.sharedId}|${entry.name}|${entry.rating}|${entry.reviews}|${entry.location}|${entry.photoId}|${entry.description}|${entry.url}\n`);
      }
      if (!ok) {
        remainder = j + 1;
        newRecord = false;
        break;
      }
    }
    if (!ok) {
      writer.once('drain', () => {
        listingMaker(i, false, remainder, photos, numPhotos);
      });
      break;
    } else {
      newRecord = true;
      leftOverPhotoIndex = 0;
      numberOfPhotos = null;
    }
  }
  // writeListings(j, numPhotos, photos);

  // return data with all of the listings
  return 'Success';
};

// class Writer {
//   constructor(file) {
//     this.writer = fs.createWriteStream(file, { flags: 'a' });
//     this.
//   }

//   write(obj) {
//     if (!this.headings) {
//       this.headings = true;
//     }
//     if (!this.writer.write(`${obj.sharedId}|${obj.name}|
// ${obj.rating}|${obj.reviews}|${obj.location}|${obj.photoId}|${obj.description}|${obj.url}\n`)) {
//       return false;
//     }
//     return true;
//   }

//   end() {
//     this.writer.end();
//   }

//   once(event, cb) {
//     this.writer.once('event', cb);
//   }
// }

(async () => {
  writer.write('sharedId|name|rating|reviews|location|photoId|description|url\n');
  writer.setMaxListeners(0);
  const photos = await getPhotos();
  listingMaker(0, true, 0, photos);
  // writer.end();
})();

//  Listing.insertMany(data) -- will
