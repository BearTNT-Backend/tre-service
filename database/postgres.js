/* eslint-disable no-console */
// const { Client } = require('pg');
const pgp = require('pg-promise')();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

let client = pgp({
  user: 'treterten',
  database: 'treterten',
  password: '^EHp8DIYc2',
});

module.exports = {
  load: async () => {
    try {
      let query = 'DROP DATABASE listingphotos';
      await client.any(query);
      query = 'CREATE DATABASE listingphotos';
      await client.any(query);
      client = pgp({
        user: 'treterten',
        database: 'listingphotos',
        password: '^EHp8DIYc2',
      });
      query = `CREATE TABLE listings (
          sharedId int UNIQUE,
          name text,
          rating float,
          reviews int,
          location text,
          PRIMARY KEY (sharedId)
      )`;
      await client.any(query);
      query = `CREATE TABLE photos (
        entryId serial,
        photoId int,
        description text,
        url text,
        sharedId int,
        PRIMARY KEY (entryId),
        CONSTRAINT fkListing
          FOREIGN KEY(sharedid)
            REFERENCES listings(sharedid)
            DEFERRABLE INITIALLY DEFERRED
      )`;
      await client.any(query);
      const usedListings = {};
      fs.createReadStream(path.resolve(__dirname, './data.csv'))
        .pipe(csv({ separator: '|' }))
        .on('data', async (listing) => {
          if (usedListings[listing.sharedId] !== true) {
            usedListings[listing.sharedId] = true;
            (async () => {
              try {
                query = `INSERT INTO listings (sharedId, name, rating, reviews, location)
                VALUES ($1, $2, $3, $4, $5)`;
                const params = [listing.sharedId, listing.name, listing.rating,
                  listing.reviews, listing.location];
                await client.any(query, params);
              } catch (error) {
                console.error(error);
              }
            })();
          }
          (async () => {
            try {
              query = 'INSERT INTO photos (photoId, description, url, sharedId) VALUES ($1, $2, $3, $4)';
              const params = [listing.photoId, listing.description, listing.url, listing.sharedId];
              await client.any(query, params);
            } catch (error) {
              // console.error(error);
            }
          })();
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
        });
    } catch (error) {
      console.error(error);
    }
  },
};
