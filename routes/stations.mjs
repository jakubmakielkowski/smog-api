import express from "express";
import { default as mongodb } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const MongoClient = mongodb.MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

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
	const station = await db.collection(process.env.DATABASE_COL_STATIONS).findOne({ "stationId": Number(stationId) });
	res.send(station);
});

export default router;