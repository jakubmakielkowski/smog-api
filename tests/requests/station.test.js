require('dotenv').config()
const axios = require('axios')

const address = `http://localhost:${process.env.PORT}`

test('/stations - Stations should be defined', async () => {
  const response = await axios.get(`${address}/stations`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Array).toBe(true)

  const [station] = data
  expect(station instanceof Object).toBe(true)
})

test('/stations?source=GIOS - Stations should be filterable by source', async () => {
  const response = await axios.get(`${address}/stations?source=GIOS`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Array).toBe(true)

  const [station] = data
  expect(station instanceof Object).toBe(true)
})

test('/stations?search=Suwałki - Stations should be searchable', async () => {
  const response = await axios.get(`${address}/stations?search=Suwałki`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Array).toBe(true)

  const [station] = data
  expect(station instanceof Object).toBe(true)
})

test('/stations?source=GIOS&search=Suwałki - Stations should be bouth filterable and searchable', async () => {
  const response = await axios.get(`${address}/stations?source=GIOS&search=Suwałki`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Array).toBe(true)

  const [station] = data
  expect(station instanceof Object).toBe(true)
})

test('/stations/:stationId - Station by existing id should be defined', async () => {
  const response = await axios.get(`${address}/stations/GIOS-114`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Object).toBeDefined()
})

test('/stations/:stationId/qualityIndex - Qualit index by existing station id should be defined', async () => {
  const response = await axios.get(`${address}/stations/GIOS-114/qualityIndex`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Object).toBeDefined()
})

test('/stations/:stationId/measurements - Station by existing id should be defined', async () => {
  const response = await axios.get(`${address}/stations/GIOS-114/measurements`)
  expect(response).toBeDefined()

  const { data } = response
  expect(data instanceof Object).toBeDefined()
})
