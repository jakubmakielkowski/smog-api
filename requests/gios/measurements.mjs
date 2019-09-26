import dotenv from 'dotenv';
import fetch from 'node-fetch';

import Measurement from '../../schemas/Measurement.mjs';
import MongoConnection from '../../utils/database/MongoConnection.mjs';
import sleep from '../../utils/sleep.mjs';

dotenv.config();

const getMeasurements = async (APIUrl) => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch(error) {
		console.log(error);
	}


	// 2. Create or recreate collection
	process.stdout.write(`getMeasurements - creating collection...\n`);
	await database.createCollection(process.env.DATABASE_COL_MEASUREMENTS, (error, result) => {
		if (error) {
			throw error;
		}
	});


	// 3. Get sensorsList from database
	const sensorsList = await database.collection(process.env.DATABASE_COL_SENSORS).find({}).toArray();
	let idsList = sensorsList.map(sensor => ({
		stationId: sensor.stationId,
		sensorId: sensor.sensorId
	}));

	for (let i = 0; i < idsList.length; i++) {
		const { stationId, sensorId } = idsList[i];
		process.stdout.write(`getMeasurements - fetching data from API... ${i}/${idsList.length}`);

		// avoid too many requests at the same time
		if (i % 50 === 0) {
			await sleep(1000);
		}

		// Fetch synchronously from GIOŚ API
		let response, measurementData;
		try {
			response = await fetch(`${APIUrl}/${sensorId}`)
			measurementData = await response.json();
		} catch (error) {

		}
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

		// Insert synchronously to db
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
		)

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
	}

	process.stdout.write(`getMeasurements request succeeded`);
	client.close();
}

getMeasurements(`http://api.gios.gov.pl/pjp-api/rest/data/getData`);

export default getMeasurements;