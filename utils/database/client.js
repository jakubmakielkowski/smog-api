const { MongoClient } = require('mongodb')

const globalClient = {}

MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    globalClient.db = client.db(process.env.DATABASE_NAME)
    console.log(`Connected to database ${process.env.DATABASE_NAME}`)
  })
  .catch((error) => {
    console.log(error)
  })

module.exports = globalClient
