const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const addMeasurement = require('./../requests/get/measurement.js')

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

// Get measurements from station sensors
router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;

	const measurement = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_MEASUREMENTS).find({ "stationId": Number(stationId) }).toArray(async (err, result) => {
			if (err) throw err;

			if (result.length) {
				resolve(result);
			} else {
				const measurements = await addMeasurement(stationId);
				resolve(measurements);
			}
		});
	});
	res.send(measurement);
});






router.post("/:stationId", async (req, res) => {
	console.log(req.params.stationId)
	// const client = await MongoConnection;
	// const db = client.db(process.env.DATABASE_NAME);

	const sensors = await fetchSensors(req.params.stationId)
	const sensorsIds = sensors.map(sensor => sensor.id);
	console.log(sensorsIds)

	for (let i = 0; i < sensorsIds.length; i++) {

	}
});

module.exports = router;