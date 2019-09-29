import dotenv from 'dotenv';
import fetch from 'node-fetch';

import MongoConnection from '../../utils/database/MongoConnection.mjs';
import QualityIndex from '../../schemas/QualityIndex.mjs';
import { fetchMeasurements } from './api/fetch.mjs';

dotenv.config();

const addQualityIndex = async (stationId) => {

	// Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	let qualityIndexData;
	try {
		qualityIndexData = await fetchMeasurements(stationId);
	} catch (error) {
		console.log(error);
	}

	let level;
	try {
		level = qualityIndexData.current.indexes[0].level;

		const qualityIndex = new QualityIndex({
			stationId: stationId,
			level: level,
			dateOfInsertion: new Date()
		});

		await database.collection("QualityIndices").updateOne(
			{ stationId: qualityIndex.stationId },
			{
				$set: {
					level: qualityIndex.level,
					dateOfInsertion: qualityIndex.dateOfInsertion
				}
			},
			{ upsert: true }
		);
		process.stdout.write(`Get QualityIndex (Airly) - succedeed`);
	} catch (error) {
		process.stdout.write(`Get QualityIndex (Airly) - failed`);
		console.log(error);
	} finally {
		client.close();
	}
}

export default addQualityIndex;