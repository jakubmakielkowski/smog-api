require('dotenv').config();
const fetch = require('node-fetch');

test('Should fetch stations from API', async () => {
  const response = await fetch(process.env.API_GIOS_STATIONS_ENDPOINT);
  expect(response).toBeDefined();

  const stationsData = await response.json();
  expect(stationsData instanceof Array).toBe(true);

  const [exampleStationData] = stationsData;
  expect(exampleStationData instanceof Object).toBe(true);
});

test('Should fetch sensor from API', async () => {
  const response = await fetch(`${process.env.API_GIOS_SENSORS_ENDPOINT}/14`);
  expect(response).toBeDefined();

  const sensorsData = await response.json();
  expect(sensorsData instanceof Array).toBe(true);

  const [exampleSensorData] = sensorsData;
  expect(exampleSensorData instanceof Object).toBe(true);
});

test('Should fetch qualityIndex from API', async () => {
  const response = await fetch(`${process.env.API_GIOS_QUALITY_INDICES_ENDPOINT}/52`);
  expect(response).toBeDefined();

  const sensorsData = await response.json();
  expect(sensorsData instanceof Object).toBe(true);
});

test('Should fetch measurement from API', async () => {
  const response = await fetch(`${process.env.API_GIOS_MEASUREMENTS_ENDPOINT}/92`);
  expect(response).toBeDefined();

  const measurementsData = await response.json();
  expect(measurementsData instanceof Object).toBe(true);

  const { key, values } = measurementsData;

  expect(typeof key).toBe('string');
  expect(values instanceof Array).toBe(true);

  const [exampleValue] = values;
  expect(exampleValue instanceof Object).toBe(true);
});
