console.log('In the server file');

const express = require('express');
const app = express();
const db = require('../database/mongo.js');
const bluebird = require('bluebird');
const path = require('path');

const port = 3003;

const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));


app.get('/carousel-module/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// CRUD ===================================================================

app.post('/api/carousel-module/photos/', (req, res) => {
  let listing = req.body;
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

  var id = req.params.id;

  db.returnListing(id, (x) => {

    var data = x;
    res.send(data);
  });

});

app.put('/api/carousel-module/photos/:id', (req, res) => {
  let newData = req.body;
  db.updateListing(req.params.id, newData).then(() => {
    res.send('Completed PUT request');
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

app.delete('/api/carousel-module/photos', (req, res) => {

});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
