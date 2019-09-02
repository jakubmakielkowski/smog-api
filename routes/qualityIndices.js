const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const qualityIndex = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_QUALITY_INDEX).findOne({ "stationId": Number(req.params.stationId) }, function (err, result) {
			if (err) throw err;
			resolve(result);
		});
	});
	res.send(qualityIndex);
});

router.get("/", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const qualityIndex = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_QUALITY_INDEX).find().sort({ stationId: -1 }).toArray(function (err, result) {
			if (err) throw err;
			resolve(result);
		});
	});
	res.send(qualityIndex);
});

module.exports = router;