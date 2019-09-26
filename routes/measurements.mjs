import dotenv from 'dotenv';
import express from "express";

import addMeasurement from '../requests/gios/measurement.mjs';
import MongoConnection from '../utils/database/MongoConnection.mjs';

dotenv.config();
const router = express.Router();


// Get measurements from station sensors
router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;

	// Get measurements data from station
	const measurements = await db.collection(process.env.DATABASE_COL_MEASUREMENTS).findOne({ "stationId": stationId });

	// Send existing data or fetch it from API if not present and then send
	if(measurements){
		res.send(measurements);
	} else {
		const newMeasurements = await addMeasurement(stationId);
		res.send(newMeasurements);
	}
});

export default router;