import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();


const fetchStations = async () => {
	const response = await fetch(`${process.env.API_GIOS_STATIONS_ENDPOINT}`);
	const installationsData = await response.json();
	return installationsData;
}

const fetchSensor = async (stationId) => {
	const response = await fetch(`${process.env.API_GIOS_SENSORS_ENDPOINT}/${stationId}`);
	const installationsData = await response.json();
	return installationsData;
}

const fetchQualityIndex = async (stationId) => {
	const response = await fetch(`${process.env.API_GIOS_QUALITY_INDICES_ENDPOINT}/${stationId}`);
	const installationsData = await response.json();
	return installationsData;
}

const fetchMeasurement = async (sensorId) => {
	const response = await fetch(`${process.env.API_GIOS_MEASUREMENTS_ENDPOINT}/${sensorId}`);
	const installationsData = await response.json();
	return installationsData;
}

export { fetchStations, fetchSensor, fetchQualityIndex, fetchMeasurement }