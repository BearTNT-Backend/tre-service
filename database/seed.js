// write my data creator here
// const mongoose = require('mongoose');
const faker = require('faker');
const ObjectsToCsv = require('objects-to-csv');
const path = require('path');
const AWS = require('aws-sdk');
// random number between two values
AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));

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

  const rating = Number(`${num}.${dec1}${dec2}`);
  return rating;
};
// =========== arrays that will hold dummy data to generate random data objects ============

// write an array of listing names
const names = ['Cabin in the woods', 'Grandma\'s cozy cottage', 'Mountain escape', 'Hut on a hill', 'Forest-side cabin', 'Luxurious time away in the woods', 'Crazy mountain container casa', '"The Burrow"', 'Beautiful Home in Scenic Area', 'Lovely Vacation Home in the Great Outdoors', 'Smokey\'s Sleepy Cave', 'The Lodge', 'Glamping is Happiness Home', 'Secluded Private Wilderness Home'];

// write an array of photo urls and descriptions
// const photos = [
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/10%2BCozy%2BCalifornia%2BCabins%2Bon%2BAirbnb%2B-%2B3.jpg', description: 'Cozy common space', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/19469.jpg', description: 'Comfortable queen bed with functional heater', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/39501703-airbnb-log.webp', description: 'Entryway to the cabin', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/adirondack-cabin-rental-warners-camp-upstate-getaway-fire-pit-lake-placid-airbnb-rental.jpg', description: 'Backyard seating area for large groups', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Airbnb-cabins-in-big-bear-lake.jpg', description: 'Outdoor firepit', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/airbnb-cabins-near-philadelphia-fall.jpg', description: 'Cabin in the fall', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Airbnb-Gear-Patrol-Lead-Full-2.jpg', description: 'Snowy season jacuzzi', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/airbnb-in-sedona-windy-rock-lodge.jpg', description: 'Open kitchen and dining space', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/airbnb-rustic-cabins-2-1d0e7999983a46a29a039ae6b12ffe1a.png', description: 'Double full beds', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/airbnb-rustic-cabins-4-08585fa8091b4aff971ec16125d8d000.png', description: 'Kitchen leading into the back yard', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Cabins-on-the-square-wimberley-creek-house-loft-bedroom.jpg', description: 'Master bedroom with queen bed', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/couples-retreat-cabin-gatlinburg.jpg', description: 'Upper level deck', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Cozy-Wood-Cabin-Ireland-Airbnb-off-grid-2-889x667.jpg', description: 'Covered rec area', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Donnas-Premier-Lodging-Cabin-Google.jpg', description: 'Spatious gathering area with fireplace', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/download-1.jpg', description: 'Lakeside relaxation', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/download-2.jpg', description: 'View of the lodge from the lake - boats available', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/download-3.jpg', description: 'Working fireplace in living space', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/download.jpg', description: 'Quaint cabin tucked away in the woods', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/hudson-valley-airbnb-cabin-8.jpg', description: 'Stocked kitchen with gas range', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/images-1.jpg', description: 'Relax on the docks', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/images.jpg', description: 'Lower level and loft', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/luna-cabin-airbnb-.webp', description: 'Spend the day here with the whole family', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/maxresdefault.jpg', description: 'The Cabin', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/original_3-cabin-rentals-airbnb-atlanta_treehouse.webp', description: 'Fun outdoor area', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/StoryBook-Unit-7-2.jpg', description: 'Wrap-around deck', photoId: null },
//   { url: 'https://beartnt-photos.s3-us-west-1.amazonaws.com/Z43EDHGWDFEUXCZAEZQYD4IR5Q.jpg', description: 'Outdoor seating', photoId: null },
// ];

const s3 = new AWS.S3();

// write a function that will pull about 8-15 photos and put them in an array

const getPhotos = async () => {
  console.log('Getting Results');
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

const randomPhotoGrouper = (photos, x) => {
  // create a result array of photos and descriptions
  const photoGroup = [];
  let i = 0;
  // let id = 1;
  while (i < x) {
    const index = getRandomNum(0, photos.length);
    const photoObj = photos[index];
    // photoObj.photoId = id;
    photoGroup.push(photoObj);
    i += 1;
    // id += 1;
  }
  return photoGroup;
};

// need to write function(s) that will build 100 data objects
const listingMaker = (max) => {
  const data = [];
  let x = 1;

  while (x <= max) {
    // this will push a single data object
    data.push({
      // all of the information matching the schema's framework
      sharedId: x,
      name: names[getRandomNum(0, names.length)],
      rating: makeRandomRating(),
      reviews: getRandomNum(4, 80), // needs a random number
      location: `${faker.address.city()}, ${faker.address.state()}, ${faker.address.country()}`,
    });
    x += 1;
  }

  const finalData = [];
  return getPhotos().then((photos) => {
    data.forEach((listing) => {
      const photosList = randomPhotoGrouper(photos, 15);
      for (let i = 0; i < photosList.length; i += 1) {
        const photo = photosList[i];
        // console.log(photo.url);
        const updatedListing = {
          sharedId: listing.sharedId,
          name: listing.name,
          rating: listing.rating,
          reviews: listing.reviews,
          location: listing.location,
          photoId: photo.photoId,
          description: photo.description,
          url: photo.url,
        };
        finalData.push(updatedListing);
      }
    });
    // return data with all of the listings
    return finalData;
  });
};

(async () => {
  const listings = await listingMaker(100);
  console.log(listings);
  const csv = new ObjectsToCsv(listings);
  await csv.toDisk(path.resolve(__dirname, './data.csv'));
  console.log('CSV Generation Complete');
})();
//  Listing.insertMany(data) -- will
