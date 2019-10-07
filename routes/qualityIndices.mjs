import dotenv from 'dotenv';
import express from "express";

import MongoConnection from '../utils/database/MongoConnection.mjs';
import addAirlyQualityIndex from '../requests/airly/qualityIndex.mjs';
import addGIOSQualityIndex from '../requests/gios/qualityIndex.mjs';

dotenv.config();
const router = express.Router();


router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;

	const station = await db.collection(process.env.DATABASE_COL_STATIONS).findOne({ "stationId": stationId });
	const qualityIndex = await db.collection(process.env.DATABASE_COL_QUALITY_INDEX).findOne({ "stationId": stationId });

	const { source } = station;

	// Send existing data or fetch it from API if not present
	if (qualityIndex) {
		res.send(qualityIndex);
	} else {
		let newQualityIndex;
		switch (source) {
			case "GIOS": newQualityIndex = await addGIOSQualityIndex(stationId); break;
			case "Airly": newQualityIndex = await addAirlyQualityIndex(stationId); break;
			default: console.log("Station source is not GIOS or Airly");
		}
		res.send(newQualityIndex);
	}
});

router.get("/", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const qualityIndices = await db.collection(process.env.DATABASE_COL_QUALITY_INDEX).find().toArray();
	res.send(qualityIndices);
});

export default router;