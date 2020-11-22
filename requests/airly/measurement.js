require('dotenv').config()

const client = require('../../utils/database/client')
const Measurement = require('../../schemas/Measurement.js')
const { idToNumber } = require('../../utils/api/id.js')
const { fetchMeasurements } = require('./helpers/api.js')

const defaultParams = ['PM10', 'PM25', 'C6H6', 'CO', 'SO2', 'NO2', 'O3']

const addMeasurement = async (stationId) => {
  let measurementData
  try {
    measurementData = await fetchMeasurements(idToNumber(stationId))
  } catch (error) {
    console.log(error)
  }

  try {
    const measurement = new Measurement({
      stationId,
      dateOfInsertion: new Date()
    })

    measurementData.history.splice(24)
    measurementData.forecast.splice(24)

    const { history } = measurementData
    const { forecast } = measurementData

    const params = history[0].values.filter((value) => defaultParams.find((param) => param === value.name))
    const paramNames = params.map((param) => param.name)

    const measurements = []
    paramNames.forEach((param) => {
      const historicValues = []
      history.forEach((element) => {
        try {
          const { value } = element.values.find((value) => value.name === param)
          historicValues.push({
            date: element.fromDateTime,
            value
          })
        } catch (error) {}
      })

      const forecastValues = []
      forecast.forEach((element) => {
        const { value } = element.values.find((value) => value.name === param)
        forecastValues.push({
          date: element.fromDateTime,
          value
        })
      })

      measurements.push({
        param,
        historicValues,
        forecastValues
      })
    })

    measurement.measurements = measurements

    await client.db.collection('Measurements').updateOne(
      { stationId: measurement.stationId },
      {
        $set: {
          measurements: measurement.measurements,
          dateOfInsertion: measurement.dateOfInsertion
        }
      },
      { upsert: true }
    )
    process.stdout.write('Get QualityIndex (Airly) - succedeed')
    return measurement
  } catch (error) {
    process.stdout.write('Get QualityIndex (Airly) - failed')
    console.log(error)
  }
}

module.exports = addMeasurement
