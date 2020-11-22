require('dotenv').config()
const express = require('express')

const addAirlyQualityIndex = require('../requests/airly/qualityIndex.js')
const addAirlyMeasurement = require('../requests/airly/measurement.js')
const addGIOSQualityIndex = require('../requests/gios/qualityIndex.js')
const addGIOSMeasurement = require('../requests/gios/measurement.js')
const isRecordObsolete = require('../utils/database/dateOfInsertion.js')
const buildQuery = require('./helpers/query.js')
const client = require('../utils/database/client')

const router = express.Router()

router.get('/', async (req, res) => {
  const query = buildQuery(req.query)

  const stations = await client.db.collection(process.env.DATABASE_COL_STATIONS).find(query).toArray()
  res.send(stations)
})

router.get('/:stationId', async (req, res) => {
  const { stationId } = req.params
  const station = await client.db.collection(process.env.DATABASE_COL_STATIONS).findOne({ stationId })
  res.send(station)
})

router.get('/:stationId/qualityIndex', async (req, res) => {
  const { stationId } = req.params

  const station = await client.db.collection(process.env.DATABASE_COL_STATIONS).findOne({ stationId })
  const qualityIndex = await client.db.collection(process.env.DATABASE_COL_QUALITY_INDEX).findOne({ stationId })

  const { source } = station

  // Send existing data or fetch it from API if not present
  if (qualityIndex && !isRecordObsolete(qualityIndex)) {
    res.send(qualityIndex)
  } else {
    let newQualityIndex
    switch (source) {
      case 'GIOS':
        newQualityIndex = await addGIOSQualityIndex(stationId)
        break
      case 'Airly':
        newQualityIndex = await addAirlyQualityIndex(stationId)
        break
      default:
        console.log('Station source is not GIOS or Airly')
    }
    res.send(newQualityIndex)
  }
})

router.get('/:stationId/measurements', async (req, res) => {
  const { stationId } = req.params

  const station = await client.db.collection(process.env.DATABASE_COL_STATIONS).findOne({ stationId })
  const measurements = await client.db.collection(process.env.DATABASE_COL_MEASUREMENTS).findOne({ stationId })

  const { source } = station

  // Send existing data or fetch it from API if not present
  if (measurements && !isRecordObsolete(measurements)) {
    res.send(measurements)
  } else {
    let newMeasurements
    switch (source) {
      case 'GIOS':
        newMeasurements = await addGIOSMeasurement(stationId)
        break
      case 'Airly':
        newMeasurements = await addAirlyMeasurement(stationId)
        break
      default:
        console.log('Station source is not GIOS or Airly')
    }
    res.send(newMeasurements)
  }
})

module.exports = router
