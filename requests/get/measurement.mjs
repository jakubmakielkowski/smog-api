import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { default as mongodb } from "mongodb";

import Measurement from '../../schemas/Measurement.mjs';

dotenv.config();
const MongoClient = mongodb.MongoClient;
const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchSensors = async (stationId) => {
	const response = await fetch(`http://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationId}`)
	const sensorsData = await response.json();
	return sensorsData;
}

const fetchMeasurements = async (sensorId) => {
	const response = await fetch(`http://api.gios.gov.pl/pjp-api/rest/data/getData/${sensorId}`)
	const measurementData = await response.json();
	return measurementData;
}

// Adds measurement data to database
const addMeasurement = async (stationId) => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	// 2. Fetch sensors
	let sensorIds;
	try {
		const sensorList = await fetchSensors(stationId);
		sensorIds = sensorList.map(sensor => sensor.id);
	} catch (error) {
		console.log(error);
	}



	// 3. For every sensor id, fetch its measurement data and put to database
	const measurementsToSend = [];
	for (let i = 0; i < sensorIds.length - 1; i++) {
		const sensorId = sensorIds[i];
		try {
			const measurementData = await fetchMeasurements(sensorIds[i]);
			const { key, values } = measurementData;

			// Only last 48 hours measurements
			values.splice(48);

			const measurement = new Measurement({
				stationId: stationId,
				sensorId: sensorId,
				param: key,
				values: values,
				dateOfInsertion: new Date()
			});

			measurementsToSend.push(measurement);

			await database.collection("Measurements").updateOne(
				{
					stationId: measurement.stationId,
					sensorId: measurement.sensorId
				},
				{
					$set: {
						param: measurement.param,
						values: measurement.values,
						dateOfInsertion: measurement.dateOfInsertion
					}
				},
				{ upsert: true }
			);
		} catch (error) {
			console.log(error)
		}
	}
	process.stdout.write(`getMeasurements request succeeded`);
	client.close();
	return measurementsToSend;	
}

export default addMeasurement;