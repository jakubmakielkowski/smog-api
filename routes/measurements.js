require('dotenv').config();
const express = require("express");

const addGIOSMeasurement = require('../requests/gios/measurement.js');
const addAirlyMeasurement = require('../requests/airly/measurement.js');
const MongoConnection = require('../utils/database/MongoConnection.js');
const isRecordObsolete = require('../utils/database/dateOfInsertion.js');

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
	if(measurements && !isRecordObsolete(measurements)){
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

module.exports =router;