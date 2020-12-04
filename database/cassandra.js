/* eslint-disable no-console */
const cassandra = require('cassandra-driver');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const contactPoints = ['127.0.0.1:9042'];
const dataCenter = 'datacenter1';
const client = new cassandra.Client({
  contactPoints,
  localDataCenter: dataCenter,
});
module.exports = {
  returnListing: () => client.connect().then(() => (`Connected to ${client.hosts.length} nodes in the cluster: ${client.hosts.keys().join(',')}`)),
  saveMany: async (data) => {
    try {
      const setupQueries = [
        {
          query: 'DROP KEYSPACE IF EXISTS listingphotos',
        },
        {
          query: 'CREATE KEYSPACE listingphotos WITH REPLICATION = {\'class\':\'SimpleStrategy\', \'replication_factor\':1}',
        },
        {
          query: `CREATE TABLE listingphotos.listing (
            sharedId int,
            name text,
            rating float,
            reviews int,
            location text,
            photoId int,
            description text,
            url text,
            PRIMARY KEY (sharedId, photoId)
          ) WITH CLUSTERING ORDER BY (photoId DESC);`,
        },
      ];
      try {
        await client.execute(setupQueries[0].query);
        await client.execute(setupQueries[1].query);
        await client.execute(setupQueries[2].query);
      } catch (err) {
        console.error(err);
      }
      try {
        await data.forEach(async (listing) => {
          await listing.photos.forEach(async (photo) => {
            const query = `INSERT INTO listingphotos.listing (sharedId, name, rating, reviews, location, photoId, description, url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            try {
              const params = [listing.sharedId, listing.name, listing.rating,
                listing.reviews, listing.location, photo.photoId, photo.description, photo.url];
              await client.execute(query, params, { prepare: true });
            } catch (error) {
              console.error(error);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      return error;
    }
    setTimeout(() => client.shutdown(), 2000);
    return 'Success!';
  },
  load: () => {
    const setupQueries = [
      {
        query: 'DROP KEYSPACE IF EXISTS listingphotos',
      },
      {
        query: 'CREATE KEYSPACE listingphotos WITH REPLICATION = {\'class\':\'SimpleStrategy\', \'replication_factor\':1}',
      },
      {
        query: `CREATE TABLE listingphotos.listing (
          sharedId int,
          name text,
          rating float,
          reviews int,
          location text,
          photoId int,
          description text,
          url text,
          PRIMARY KEY (sharedId, photoId)
        ) WITH CLUSTERING ORDER BY (photoId DESC);`,
      },
      {
        query: `COPY listingphotos.listing
        FROM 'data.csv'
        WITH DELIMITER = ','
          AND HEADER = TRUE;`,
      },
    ];
    (async () => {
      try {
        await client.execute(setupQueries[0].query);
        await client.execute(setupQueries[1].query);
        await client.execute(setupQueries[2].query);
        fs.createReadStream(path.resolve(__dirname, './data.csv'))
          .pipe(csv())
          .on('data', (listing) => {
            console.log(listing);
            const query = `INSERT INTO listingphotos.listing (sharedId, name, rating, reviews, location, photoId, description, url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            (async () => {
              try {
                const params = [listing.sharedId, listing.name, listing.rating,
                  listing.reviews, listing.location, listing.photoId,
                  listing.description, listing.url];
                await client.execute(query, params, { prepare: true });
              } catch (error) {
                console.error(error);
              }
            })();
          })
          .on('end', () => {
            console.log('CSV file successfully processed');
          });
        console.log('Success.');
      } catch (err) {
        console.error(err);
      }
    })();
  },
};
