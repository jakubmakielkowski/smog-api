const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;
	const qualityIndex = await db.collection(process.env.DATABASE_COL_QUALITY_INDEX).findOne({ "stationId": Number(stationId) });
	res.send(qualityIndex);
});

router.get("/", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const qualityIndices = await db.collection(process.env.DATABASE_COL_QUALITY_INDEX).find().toArray();
	res.send(qualityIndices);
});

module.exports = router;