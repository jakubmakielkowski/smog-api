import dotenv from 'dotenv';
import fetch from 'node-fetch';

import Station from '../../schemas/Station.mjs';
import MongoConnection from '../../utils/database/MongoConnection.mjs';

dotenv.config();

const getStations = async () => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	// 2. Fetch data from API
	const requestOptions = {
		lat: 51.919231,
		lng: 19.134422,
		maxResults: 10000,
		maxDistanceKM: 450
	}
	const requestHeaders = {
		'Accept': 'application/json',
		'apikey': process.env.API_AIRLY_KEY
	};
	let installationsList;
	try {
		const { lat, lng, maxResults, maxDistanceKM } = requestOptions;
		const response = await fetch(`${process.env.API_AIRLY_INSTALLATIONS_ENDPOINT}?lat=${lat}&lng=${lng}&maxResults=${maxResults}&maxDistanceKM=${maxDistanceKM}`,
			{
				headers: requestHeaders
			});
		installationsList = await response.json();
	} catch (error) {
		console.log(error);
	}

	// 3. Add stations to database
	for (let i = 0; i < installationsList.length; i++) {
		process.stdout.write(`Get Stations (Airly) - adding to database... ${i+1}/${installationsList.length}`);

		const installation = installationsList[i];

		// If sponsor is NOT GIOS and location is Poland then add to database
		if (installation.sponsor.id !== 11 && installation.address.country === "Poland") {
			const { id, location } = installation;
			const { city, street } = installation.address;

			const station = new Station({
				stationId: `Airly-${id}`,
				location: {
					latitude: location.latitude,
					longitude: location.longitude
				},
				address: {
					city: city,
					street: street
				},
				source: "Airly"
			});

			if (installation.sponsor.id !== 556) {
				station.sponsor = {
					name: installation.sponsor.name,
					description: installation.sponsor.description,
					logo: installation.sponsor.logo,
					link: installation.sponsor.link
				};
			}

			// Insert station to db
			await database.collection(process.env.DATABASE_COL_STATIONS).updateOne(
				{ stationId: station.stationId },
				{
					$set: {
						location: station.location,
						address: station.address,
						sponsor: station.sponsor,
						source: station.source
					}
				},
				{ upsert: true }
			);
		}

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
	}

	process.stdout.write(`Get Stations (Airly) - succedeed`);
	client.close();
}

getStations();

export default getStations;