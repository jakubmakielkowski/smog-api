require('dotenv').config()

const { client, initializeClient } = require('./client.js')

// Create stations index
const createIndex = async () => {
  process.stdout.write('\n Connecting to database...')
  await initializeClient()

  process.stdout.write('\n Creating text search index...')
  client.db.collection(process.env.DATABASE_COL_STATIONS).createIndex({
    'address.city': 'text',
    'address.street': 'text'
  })

  process.exit()
}

createIndex()
