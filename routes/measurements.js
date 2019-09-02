const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const measurement = await new Promise((resolve, reject) => {
		db.collection(process.env.DATABASE_COL_MEASUREMENTS).find({ "stationId": Number(req.params.stationId) }).toArray(function (err, result) {
			if (err) throw err;
			resolve(result);
		});
	});
	res.send(measurement);
});

module.exports = router;