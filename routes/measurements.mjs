import express from "express";
import { default as mongodb } from "mongodb";
import dotenv from 'dotenv';

import addMeasurement from '../requests/get/measurement.mjs';

dotenv.config();
const router = express.Router();
const MongoClient = mongodb.MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

// Get measurements from station sensors
router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;

	// Get measurements data from station
	const measurements = await db.collection(process.env.DATABASE_COL_MEASUREMENTS).find({ "stationId": Number(stationId) }).toArray();

	// Send existing data or fetch it from API if not present and then send
	if(measurements.length){
		res.send(measurements);
	} else {
		const newMeasurements = await addMeasurement(stationId);
		res.send(newMeasurements);
	}
});

export default router;