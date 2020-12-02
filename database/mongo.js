// to run a mongo file, from the shell execute "mongo < FILENAME.js"
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/photo-carousel'; // setting up a photo-carousel db



mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

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
      photoId: Number
    }
  ]
});

let Listing = mongoose.model('Listing', listingsSchema);

let saveMany = (data) => {
  Listing.remove({}, function(err) {
    console.log('old listing collection removed');
  });

  Listing.insertMany(data)
    .then(()=>{
      console.log('DATA ADDED SUCCESSFULLY');
      console.log(data);
    })
    .catch((error)=>{
      console.log(error);
    });
};

let insert = (data) => {
  return Listing.create(data).then(() => {
    console.log(JSON.stringify(data));
    return 'Success!';
  });
};

let returnListing = (id, cb) => {
  Listing.find({sharedId: id})
    .then( data => {
      console.log('THIS IS THE DATA FROM returnListing:', data);
      cb(data);
    })
    .catch( err => {
      console.log('err found:', err);
    });

};

let updateListing = (id, newData) => {
  return Listing.update({sharedId: id}, newData).then((err, numAffected) => {
    return numAffected;
  });
};

module.exports.saveMany = saveMany;
module.exports.returnListing = returnListing;
module.exports.insert = insert;
module.exports.updateListing = updateListing;