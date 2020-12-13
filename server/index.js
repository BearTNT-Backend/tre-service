console.log('In the server file');
require('newrelic');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../database/cassandra.js');

const port = 3003;

app.use(express.static(`${__dirname}/../client/dist`));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/carousel-module/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
app.get('/loaderio-*', (req, res) => {
  res.sendFile(path.resolve(__dirname, `../${process.env.LOADERIO_FILENAME}.txt`));
});

// CRUD ===================================================================

app.post('/api/carousel-module/photos/', (req, res) => {
  const listing = req.body;
  console.log(req.body);
  db.insert(listing).then((results) => {
    console.log(results);
    res.send('Success');
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

app.get('/api/carousel-module/photos/:id', (req, res) => {
  console.log('IN THE GET REQUEST');

  const { id } = req.params;

  db.returnListing(id).then((x) => {
    const photos = x.rows.map((row) => ({
      description: row.description,
      url: row.url,
      photoId: row.photoid,
    }));
    const listing = {
      sharedId: x.rows[0].sharedId,
      name: x.rows[0].name,
      rating: x.rows[0].rating,
      reviews: x.rows[0].reviews,
      location: x.rows[0].location,
      photos,
    };
    res.send([listing]);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

app.put('/api/carousel-module/photos/:id', (req, res) => {
  const newData = req.body;
  db.updateListingPhoto(req.params.id, req.params.photo.id, newData).then(() => {
    res.send('Completed PUT request');
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

app.delete('/api/carousel-module/photos/:id', (req, res) => {
  db.removeListingPhoto(req.params.id, req.params.photo.id).then((results) => {
    res.send(results);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
