// to run a mongo file, from the shell execute "mongo < FILENAME.js"
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost/photo-carousel'; // setting up a photo-carousel db

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const listingsSchema = new mongoose.Schema({
  sharedId: Number,
  name: String,
  rating: Number,
  reviews: Number,
  location: String,
  photos: [
    {
      description: String,
      url: String,
      photoId: Number,
    },
  ],
});

const Listing = mongoose.model('Listing', listingsSchema);

const saveMany = (data) => {
  Listing.remove({}, () => {
    Listing.insertMany(data)
      .then(() => {
        console.log('DATA ADDED SUCCESSFULLY');
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const removeListing = (id) => Listing.deleteOne({ sharedId: id }).then(() => 'Successfully removed listing.');

const insert = (data) => Listing.create(data).then(() => {
  console.log(JSON.stringify(data));
  return 'Success!';
});

const returnListing = (id, cb) => {
  Listing.find({ sharedId: id })
    .then((data) => {
      console.log('THIS IS THE DATA FROM returnListing:', data);
      cb(data);
    })
    .catch((err) => {
      console.log('err found:', err);
    });
};

const updateListing = (id, newData) => Listing.update({ sharedId: id }, newData)
  .then((err, numAffected) => numAffected);

module.exports.saveMany = saveMany;
module.exports.returnListing = returnListing;
module.exports.insert = insert;
module.exports.updateListing = updateListing;
module.exports.removeListing = removeListing;
