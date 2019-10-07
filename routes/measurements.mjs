import dotenv from 'dotenv';
import express from "express";

import addGIOSMeasurement from '../requests/gios/measurement.mjs';
import addAirlyMeasurement from '../requests/airly/measurement.mjs';
import MongoConnection from '../utils/database/MongoConnection.mjs';

dotenv.config();
const router = express.Router();


// Get measurements from station sensors
router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;

	const station = await db.collection(process.env.DATABASE_COL_STATIONS).findOne({ "stationId": stationId });
	const measurements = await db.collection(process.env.DATABASE_COL_MEASUREMENTS).findOne({ "stationId": stationId });

	const { source } = station;

	// Send existing data or fetch it from API if not present
	if(measurements){
		res.send(measurements);
	} else {
		let newMeasurements;
		switch(source){
			case "GIOS": newMeasurements = await addGIOSMeasurement(stationId); break;
			case "Airly": newMeasurements = await addAirlyMeasurement(stationId); break;
			default: console.log("Station source is not GIOS or Airly");
		}
		res.send(newMeasurements);
	}
});

export default router;