import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { default as mongodb } from "mongodb";

import QualityIndex from '../../schemas/QualityIndex.mjs';
import sleep from '../../utils/sleep.mjs';

dotenv.config();
const MongoClient = mongodb.MongoClient;
const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true });

const getQualityIndices = async (APIUrl) => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch(error) {
		console.log(error);
	}


	// 2. Get stations ids
	const stationsList = await database.collection(process.env.DATABASE_COL_STATIONS).find({}).toArray();
	const stationsIds = stationsList.map(station => station.stationId);

	// Create or use existing collection
	process.stdout.write(`getQualityIndices - creating collection...\n`);
	await database.createCollection(process.env.DATABASE_COL_QUALITY_INDEX, (err, res) => {
		if (err) throw err;
	});


	for (let i = 0; i < stationsIds.length; i++) {
		process.stdout.write(`getQualityIndices - fetching data from API... ${i}/${stationsIds.length}`);
		const stationId = stationsIds[i];

		// avoid too many requests at the same time
		if (i % 50 === 0) {
			await sleep(1000);
		}

		let qualitySensorData;
		try {
			const response = await fetch(`${APIUrl}/${stationId}`);
			qualitySensorData = await response.json();
		} catch(error) {

		}

		const {
			id,
			stIndexLevel,
			so2IndexLevel,
			no2IndexLevel,
			coIndexLevel,
			pm10IndexLevel,
			pm25IndexLevel,
			o3IndexLevel,
			c6h6IndexLevel
		} = qualitySensorData || {};

		const qualityIndex = new QualityIndex({
			stationId: id,
			levels: {
				st: stIndexLevel && stIndexLevel.indexLevelName,
				so2: so2IndexLevel && so2IndexLevel.indexLevelName,
				no2: no2IndexLevel && no2IndexLevel.indexLevelName,
				co: coIndexLevel && coIndexLevel.indexLevelName,
				pm10: pm10IndexLevel && pm10IndexLevel.indexLevelName,
				pm25: pm25IndexLevel && pm25IndexLevel.indexLevelName,
				o3: o3IndexLevel && o3IndexLevel.indexLevelName,
				c6h6: c6h6IndexLevel && c6h6IndexLevel.indexLevelName
			},
			dateOfInsertion: new Date()
		});

		database.collection("QualityIndices").updateOne(
			{ stationId: qualityIndex.stationId },
			{
				$set: {
					levels: qualityIndex.levels,
					dateOfInsertion: qualityIndex.dateOfInsertion
				}
			},
			{ upsert: true }
		)
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
	}

	process.stdout.write(`getQualityIndices succedeed\n`);
	client.close();
}

getQualityIndices("http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex");

export default getQualityIndices;