require('dotenv').config()
const axios = require('axios')

const fetchStations = async () => {
  const response = await axios.get(`${process.env.API_GIOS_STATIONS_ENDPOINT}`)
  return response.data
}

const fetchSensor = async (stationId) => {
  const response = await axios.get(`${process.env.API_GIOS_SENSORS_ENDPOINT}/${stationId}`)
  return response.data
}

const fetchQualityIndex = async (stationId) => {
  const response = await axios.get(`${process.env.API_GIOS_QUALITY_INDICES_ENDPOINT}/${stationId}`)
  return response.data
}

const fetchMeasurement = async (sensorId) => {
  const response = await axios.get(`${process.env.API_GIOS_MEASUREMENTS_ENDPOINT}/${sensorId}`)
  return response.data
}

module.exports = {
  fetchStations,
  fetchSensor,
  fetchQualityIndex,
  fetchMeasurement
}
