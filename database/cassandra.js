const cassandra = require('cassandra-driver');

const contactPoints = ['127.0.0.1:9042'];
const keyspace = 'listingphotos';
const dataCenter = 'datacenter1';
const client = new cassandra.Client({
  contactPoints,
  localDataCenter: dataCenter,
  keyspace,
});
module.exports = {
  returnListing: () => client.connect().then(() => (`Connected to ${client.hosts.length} nodes in the cluster: ${client.hosts.keys().join(',')}`)),
};
