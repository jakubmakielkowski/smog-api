import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { default as mongodb } from "mongodb";

import Station from '../../schemas/Station.mjs';

dotenv.config();
const MongoClient = mongodb.MongoClient;
const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true });

const getStations = async (APIUrl) => {
	// 1. Connect with database
	process.stdout.write(`getStations - connecting to db...`);
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch(error) {
		console.log(error);
	}



	// 2. Fetch stations data
	process.stdout.write(`\ngetStations - fetching data from API...`);
	let stationsData;
	try {
		const response = await fetch(`${APIUrl}`);
		stationsData = await response.json();
	} catch (error) {
		throw error;
	}



	// 3. Create or recreate collection
	process.stdout.write(`\ngetStations - creating collection...`);
	await database.createCollection(process.env.DATABASE_COL_STATIONS, (err, res) => {
		if (err) {
			throw err;
		}
	});



	// 4. Insert stations
	process.stdout.write(`\ngetStations - inserting to database...`);
	for (let i = 0; i < stationsData.length; i++) {
		const stationData = stationsData[i];
		const { id, gegrLat, gegrLon, addressStreet } = stationData;
		const { provinceName, districtName, communeName } = stationData.city && stationData.city.commune || {};

		const station = new Station({
			stationId: id,
			location: {
				latitude: gegrLat,
				longitude: gegrLon
			},
			address: {
				province: provinceName || null,
				district: districtName || null,
				city: communeName || null,
				street: addressStreet || null
			}
		});

		// Insert station to db
		await database.collection("Stations").updateOne(
			{ stationId: station.stationId },
			{
				$set: {
					location: station.location,
					address: station.address
				}
			},
			{ upsert: true }
		)
	}

	process.stdout.write(`\ngetStations succedeed`);
	client.close();
}

getStations(`https://api.gios.gov.pl/pjp-api/rest/station/findAll`);

export default getStations;