import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { default as mongodb } from "mongodb";

import Sensor from '../../schemas/Sensor.mjs';
import sleep from '../../utils/sleep.mjs';

dotenv.config();
const MongoClient = mongodb.MongoClient;
const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true });

const getSensors = async (APIUrl) => {
	
	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}


	// 2. Get stations ids
	const stationsList = await database.collection(process.env.DATABASE_COL_STATIONS).find({}).toArray();


	// 3. Create or recreate collection
	process.stdout.write(`\ngetStations - creating collection...`);
	await database.createCollection(process.env.DATABASE_COL_STATIONS, (err, res) => {
		if (err) {
			throw err;
		}
	});


	for (let i = 0; i < stationsList.length; i++) {
		process.stdout.write(`getSensors - fetching data from API... ${i}/${stationsList.length}`);
		const station = stationsList[i];
		const { stationId } = station;

		// avoid too many requests at the same time
		if (i % 50 === 0) {
			await sleep(1000);
		}

		let sensorsList;
		try {
			const response = await fetch(`${APIUrl}/${stationId}`)
			sensorsList = await response.json();
		} catch (error) {

		}

		for (let j = 0; j < sensorsList.length; j++) {
			const { id } = sensorsList[j];
			const { paramCode, paramName } = sensorsList[j].param || {};
			const sensor = new Sensor({
				stationId: stationId,
				sensorId: id,
				param: {
					code: paramCode,
					name: paramName
				}
			});

			await database.collection("Sensors").updateOne(
				{ stationId: stationId },
				{
					$set: {
						sensorId: sensor.sensorId,
						param: sensor.param
					}
				},
				{ upsert: true }
			)
		}

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
	}

	process.stdout.write(`getSensors succedeed\n`);
	client.close();
}

getSensors(`https://api.gios.gov.pl/pjp-api/rest/station/sensors`);

export default getSensors;