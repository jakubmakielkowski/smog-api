require('dotenv').config();

const MongoConnection = require('../../utils/database/MongoConnection.js');
const Station = require('../../schemas/Station.js');
const { fetchInstallations } = require('./api/fetch.js');

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
	let installationsList;
	try {
		installationsList = await fetchInstallations();
	} catch (error) {
		console.log(error);
	}

	// 3. Add stations to database
	for (let i = 0; i < installationsList.length; i++) {
		process.stdout.write(`Get Stations (Airly) - adding to database... ${i+1}/${installationsList.length}`);

		const installation = installationsList[i];

		// If sponsor is NOT GIOS and location is Poland
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

module.exports =getStations;