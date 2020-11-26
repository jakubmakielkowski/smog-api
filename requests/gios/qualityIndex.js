require('dotenv').config()

const { client } = require('../../utils/database/client')
const QualityIndex = require('../../schemas/QualityIndex.js')
const { idToNumber } = require('../../utils/api/id.js')
const { fetchQualityIndex } = require('./helpers/api.js')

const getQualityIndex = async (stationId) => {
  let qualitySensorData
  try {
    qualitySensorData = await fetchQualityIndex(idToNumber(stationId))
  } catch (error) {
    console.log(error)
  }

  const { stIndexLevel } = qualitySensorData || {}

  const qualityIndex = new QualityIndex({
    stationId,
    level: stIndexLevel && stIndexLevel.indexLevelName,
    dateOfInsertion: new Date()
  })

  client.db.collection('Stations').updateOne(
    { stationId: qualityIndex.stationId },
    {
      $set: {
        level: qualityIndex.level,
        dateOfInsertion: qualityIndex.dateOfInsertion
      }
    },
    { upsert: true }
  )

  process.stdout.write('getQualityIndex succedeed\n')
  return qualityIndex
}

module.exports = getQualityIndex
