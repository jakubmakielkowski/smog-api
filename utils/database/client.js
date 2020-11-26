require('dotenv').config()
const { MongoClient } = require('mongodb')

const client = {}

const initializeClient = async () => {
  try {
    const newClient = await MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true })
    client.db = newClient.db(process.env.DATABASE_NAME)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { client, initializeClient }
