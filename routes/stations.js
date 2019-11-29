const express =   require("express");
require('dotenv').config();

const MongoConnection = require('../utils/database/MongoConnection.js');

const router = express.Router();

router.get("/search", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { name } = req.query;
	const stations = await db.collection(process.env.DATABASE_COL_STATIONS).find({ $text: { $search: String(name) } }).toArray();
	res.send(stations);
});

router.get("/", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const stations = await db.collection(process.env.DATABASE_COL_STATIONS).find().toArray();
	res.send(stations);
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;
	const station = await db.collection(process.env.DATABASE_COL_STATIONS).findOne({ "stationId": stationId });
	res.send(station);
});

module.exports =router;