# BearTnT - System Design Capstone

## Table of Contents

1. [CRUD API](#CRUD)
1. [Database-Performance](#Database)
1. [Installation](#Installing)


## CRUD API

*The below URL's should be prefixed with /api*
Action | Method | URL
-------|--------|-----
Create a new listing | POST | /carousel-module/photos/
Get listing information for the carousel | GET | /carousel-module/photos/:id
Update listing information for the carousel | PUT | /carousel-module/photos/:id
Delete a listing | DELETE | /carousel-module/photos/:id

## Database Performance

### Cassandra

Action | Query | Time
-------|-------|------
Read | SELECT * FROM listingphotos.listing WHERE sharedId = 9000000 | 16.896ms
Create | INSERT INTO listingphotos.listing(sharedId, photoId, description, location, name, rating, reviews, url) VALUES (100000000, 641, 'This is a test listing.', 'St.Louis MO', 'The Good Place', 5.0, 31, 'https://tre-sdc-images.s3.amazonaws.com/image678.jpg'); | 3.639ms
Update | UPDATE listingphotos.listing SET description='This is another test listing' WHERE sharedid=100000000 AND photoid=641; | 1.112ms
Delete | DELETE FROM listingphotos.listing WHERE sharedid=100000000 AND photoid=641; | 1.424ms

### Postgresql
Action | Query | Time
-------|-------|------
Read | SELECT * FROM listingphotos WHERE sharedid= 9000000; | 8386.340ms
Create | INSERT INTO listingphotos(sharedId, photoId, description, location, name, rating, reviews, url) VALUES (100000000, 641, 'This is a test listing.', 'St.Louis MO', 'The Good Place', 5.0, 31, 'https://tre-sdc-images.s3.amazonaws.com/image678.jpg'); | 18.274ms
Update | UPDATE listingphotos SET description = 'This is another test listing.' WHERE entryid=85085314; | 16.795ms
Delete | DELETE FROM listingphotos WHERE entryid=85085314 | 15.516ms

## Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

