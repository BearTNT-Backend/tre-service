/* eslint-disable no-console */
const cassandra = require('cassandra-driver');
require('dotenv').config({ path: '../config.env' });

const contactPoints = [process.env.DB_URL];
const dataCenter = 'datacenter1';
const client = new cassandra.Client({
  contactPoints,
  localDataCenter: dataCenter,
  pooling: {
    maxRequestsPerConnection: 1000000000000,
  },
  socketOptions: { readTimeout: 0 },
});
module.exports = {

  returnListing: (id) => client.connect()
    .then(() => {
      console.log(`Connected to ${client.hosts.length} nodes in the cluster: ${client.hosts.keys().join(',')}`);
      const query = 'SELECT * FROM listingphotos.listing WHERE sharedId = ?';
      console.log(id);
      return client.execute(query, [id], { prepare: true });
    }),

  updateListingPhoto: (id, photoid, newData) => client.connect()
    .then(() => {
      const query = 'UPDATE listingphotos.listing SET ? = ? WHERE sharedId = ?';
      return client.execute(query, [Object.keys(newData)[0],
        Object.values(newData)[0], id, photoid]);
    }),

  removeListingPhoto: (id, photoid) => client.connect()
    .then(() => {
      const query = 'DELETE FROM listingphotos.listing WHERE sharedid=? AND photoid=?';
      return client.execute(query, [id, photoid]);
    }),

  addPhoto: (listing, photo) => client.connect()
    .then(() => {
      const query = 'INSERT INTO listingphotos.listing(sharedId, photoId, description, location, name, rating, reviews, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      return client.execute(query, [listing.sharedId, photo.photoId, listing.description,
        listing.location, listing.name, listing.rating, listing.reviews, listing.url]);
    }),

};
