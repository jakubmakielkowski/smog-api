import dotenv from 'dotenv';
import fetch from 'node-fetch';

import Measurement from '../../schemas/Measurement.mjs';
import MongoConnection from '../../utils/database/MongoConnection.mjs';

dotenv.config();

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
		// stationIds are in 'GIOS-n' format, replace to 'n'
		const id = stationId.replace(/\D/g,'');
		const sensorList = await fetchSensors(id);
		sensorIds = sensorList.map(sensor => sensor.id);
	} catch (error) {
		console.log(error);
	}



	// 3. For every sensor id, fetch its measurement data
	const measurements = [];

	const measurement = new Measurement({
		stationId: stationId,
		dateOfInsertion: new Date(),
		measurements: []
	});

	for (let i = 0; i < sensorIds.length - 1; i++) {
		const sensorId = sensorIds[i];
		try {
			const measurementData = await fetchMeasurements(sensorIds[i]);
			const { key, values } = measurementData;

			values.splice(48);

			const current = {
				sensorId: sensorId,
				param: key,
				values: values
			}

			measurement.measurements.push(current);
		} catch (error) {
			console.log(error)
		}
	}

	await database.collection("Measurements").updateOne(
		{
			stationId: measurement.stationId
		},
		{
			$set: {
				measurements: measurement.measurements,
				dateOfInsertion: measurement.dateOfInsertion
			}
		},
		{ upsert: true }
	);

	process.stdout.write(`getMeasurements request succeeded`);
	client.close();
	return measurements;	
}

export default addMeasurement;