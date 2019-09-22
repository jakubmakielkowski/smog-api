import express from "express";
import { default as mongodb } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const MongoClient = mongodb.MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;
	const sensor = await db.collection(process.env.DATABASE_COL_SENSORS).find({ "stationId": Number(stationId) }).toArray();
	res.send(sensor);
});

export default router;