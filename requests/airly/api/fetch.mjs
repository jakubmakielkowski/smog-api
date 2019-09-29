import dotenv from 'dotenv';
import fetch from 'node-fetch';

const requestHeaders = {
	'Accept': 'application/json',
	'apikey': process.env.API_AIRLY_KEY
};

const fetchInstallations = async (stationId) => {
	const lat = 51.919231;
	const lng = 19.134422;
	const maxResults = 10000;
	const maxDistanceKM = 450;

	const response = await fetch(`${process.env.API_AIRLY_INSTALLATIONS_ENDPOINT}?lat=${lat}&lng=${lng}&maxResults=${maxResults}&maxDistanceKM=${maxDistanceKM}`,
		{
			headers: requestHeaders
		});

	const installationsData = await response.json();
	return installationsData;
}

const fetchMeasurements = async (stationId) => {
	const installationId = stationId;

	const response = await fetch(`${process.env.API_AIRLY_MEASUREMENTS_ENDPOINT}?installationId=${installationId}`,
		{
			headers: requestHeaders
		});

	const measurementData = await response.json();
	return measurementData;
}

export { fetchInstallations, fetchMeasurements }