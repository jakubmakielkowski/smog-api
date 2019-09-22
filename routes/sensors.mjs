import express from "express";
import dotenv from 'dotenv';

import MongoConnection from '../utils/database/MongoConnection.mjs';

dotenv.config();
const router = express.Router();


router.get("/:stationId", async (req, res) => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);

	const { stationId } = req.params;
	const sensor = await db.collection(process.env.DATABASE_COL_SENSORS).find({ "stationId": Number(stationId) }).toArray();
	res.send(sensor);
});

export default router;