require('dotenv').config();
const { MongoClient } = require('mongodb');

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

module.exports = MongoConnection;
