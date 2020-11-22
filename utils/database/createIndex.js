require('dotenv').config()

const MongoConnection = require('./MongoConnection.js')

// Create stations index
const createIndex = async () => {
  const client = await MongoConnection
  const db = client.db(process.env.DATABASE_NAME)

  await db.collection(process.env.DATABASE_COL_STATIONS).createIndex({
    'address.city': 'text',
    'address.street': 'text'
  })

  console.log('Stations text index created')
  process.exit()
}

createIndex()
