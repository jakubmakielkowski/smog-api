import dotenv from 'dotenv';

import QualityIndex from '../../schemas/QualityIndex.mjs';
import MongoConnection from '../../utils/database/MongoConnection.mjs';
import { idToNumber } from '../../utils/api/id.mjs';
import { fetchQualityIndex } from './api/fetch.mjs';

dotenv.config();

const getQualityIndex = async (stationId) => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	let qualitySensorData;
	try {
		qualitySensorData = await fetchQualityIndex(idToNumber(stationId));
	} catch (error) {
		console.log(error);
	}

	const {
		stIndexLevel
	} = qualitySensorData || {};

	const qualityIndex = new QualityIndex({
		stationId: stationId,
		level: stIndexLevel && stIndexLevel.indexLevelName,
		dateOfInsertion: new Date()
	});

	database.collection("QualityIndices").updateOne(
		{ stationId: qualityIndex.stationId },
		{
			$set: {
				level: qualityIndex.level,
				dateOfInsertion: qualityIndex.dateOfInsertion
			}
		},
		{ upsert: true }
	)

	process.stdout.write(`getQualityIndex succedeed\n`);
	client.close();
	return qualityIndex;
}

export default getQualityIndex;