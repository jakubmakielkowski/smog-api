const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

router.get("/search", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);
	const stations = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_STATIONS).find({ $text: { $search: req.query.name } }).toArray((error, result) => {
			resolve(result);
		});
	});
	res.send(stations);
});

router.get("/", async (req, res) => {
	const client = await MongoConnection
	const db = client.db(process.env.DATABASE_NAME);
	const stations = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_STATIONS).find().sort({ stationId: -1 }).toArray((error, result) => {
			resolve(result);
		});
	});
	res.send(stations);
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const stations = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_STATIONS).findOne({ "stationId": Number(req.params.stationId) }, (error, result) => {
			resolve(result);
		});
	});

	res.send(stations);
});

module.exports = router;