require('dotenv').config();
const fetch = require('node-fetch');

const requestHeaders = {
  Accept: 'application/json',
  apikey: process.env.API_AIRLY_KEY,
};

test('Should fetch installations from API', async () => {
  const response = await fetch(`${process.env.API_AIRLY_INSTALLATIONS_ENDPOINT}?lat=${51}&lng=${19}&maxResults=${3}&maxDistanceKM=${50}`, {
    headers: requestHeaders,
  });
  expect(response).toBeDefined();

  const installationsData = await response.json();
  expect(installationsData instanceof Array).toBe(true);

  const [exampleInstallationData] = installationsData;
  expect(exampleInstallationData instanceof Object).toBe(true);
});

test('Should fetch measuement from API', async () => {
  const response = await fetch(`${process.env.API_AIRLY_INSTALLATIONS_ENDPOINT}?installationId=${189}`, {
    headers: requestHeaders,
  });
  expect(response).toBeDefined();

  const installationsData = await response.json();
  expect(installationsData instanceof Object).toBe(true);
});
