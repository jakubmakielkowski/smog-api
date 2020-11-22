require('dotenv').config()
const axios = require('axios')

const requestHeaders = {
  Accept: 'application/json',
  apikey: process.env.API_AIRLY_KEY
}

const fetchInstallations = async () => {
  const lat = 51.919231
  const lng = 19.134422
  const maxResults = 10000
  const maxDistanceKM = 450

  const response = await axios.get(
    `${process.env.API_AIRLY_INSTALLATIONS_ENDPOINT}?lat=${lat}&lng=${lng}&maxResults=${maxResults}&maxDistanceKM=${maxDistanceKM}`,
    {
      headers: requestHeaders
    }
  )

  return response.data
}

const fetchMeasurements = async (stationId) => {
  const installationId = stationId

  const response = await axios.get(`${process.env.API_AIRLY_MEASUREMENTS_ENDPOINT}?installationId=${installationId}`, {
    headers: requestHeaders
  })

  return response.data
}

module.exports = { fetchInstallations, fetchMeasurements }
