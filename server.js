require('dotenv').config()
const express = require('express')
const compression = require('compression')

const stations = require('./routes/stations.js')

const app = express()

app.use(compression())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use('/stations', stations)

const { initializeClient } = require('./utils/database/client.js')

initializeClient()

app.listen(process.env.PORT || 80, () => console.log(`Example app listening on ${process.env.PORT || 80}!`))
