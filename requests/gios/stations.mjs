import dotenv from 'dotenv';
import fetch from 'node-fetch';

import Station from '../../schemas/Station.mjs';
import MongoConnection from '../../utils/database/MongoConnection.mjs';

dotenv.config();


const getStations = async () => {
	// 1. Connect with database
	process.stdout.write(`Get Stations (GIOS) - connecting to db...`);
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch(error) {
		console.log(error);
	}



	// 2. Fetch stations data
	process.stdout.write(`\nGet Stations (GIOS) - fetching data from API...`);
	let stationsData;
	try {
		const response = await fetch(`${process.env.API_GIOS_STATIONS_ENDPOINT}`);
		stationsData = await response.json();
	} catch (error) {
		throw error;
	}

	// 3. Insert stations
	for (let i = 0; i < stationsData.length; i++) {

		process.stdout.write(`Get Stations (GIOS) - inserting to database... ${i+1}/${stationsData.length}`);

		const stationData = stationsData[i];
		const { id, gegrLat, gegrLon, addressStreet } = stationData;
		const { provinceName, districtName, communeName } = stationData.city && stationData.city.commune || {};

		const station = new Station({
			stationId: `GIOS-${id}`,
			location: {
				latitude: gegrLat,
				longitude: gegrLon
			},
			address: {
				province: provinceName || null,
				district: districtName || null,
				city: communeName || null,
				street: addressStreet || null
			},
			source: "GIOS"
		});

		// Insert station to db
		await database.collection("Stations").updateOne(
			{ stationId: station.stationId },
			{
				$set: {
					location: station.location,
					address: station.address,
					source: station.source
				}
			},
			{ upsert: true }
		);

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
	}

	process.stdout.write(`Get Stations (GIOS) succedeed`);
	client.close();
}

getStations();

export default getStations;