import React from 'react';
// import rendered from 'react-test-renderer';
import App from './client/App.jsx';
import axios from 'axios';

// test('dummy test is running', () => {
//   expect(3).toBe(3);
// });
describe('Dummy', () => {
  it('Should be working', () => {
    expect(3).toBe(3);
  });
});

describe('Server', () => {
  it('Should pull 100 listings from the database', () => {
    expect(axios.get('http://localhost:3003/api/carousel-module/photos/1')).then((res) => {
      expect(res.data.length > 1).toBe(true);
    });
  });
  it('Should successfully insert a listing into the database', () => {
    let listing = {
      sharedID: 9001,
      name: 'Testing Park',
      rating: 2.5,
      reviews: 231,
      location: 'Nowhere, Wyoming',
      photos: [
        {
          description: 'Enjoy gorgeous views',
          url: 'beartnt-photos.s3-us-west-1.amazonaws.com/Airbnb-cabins-in-big-bear-lake.jpg',
          photoId: 23123
        }
      ]
    };
    axios.post('http://localhost:3003/api/carousel-module/photos/', listing)
      .then((response) => {
        expect(response.status).toBe(200);
      }).catch((err) => {
        console.error(err);
      });
  });
});
