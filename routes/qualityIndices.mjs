import dotenv from 'dotenv';
import express from "express";

import MongoConnection from '../utils/database/MongoConnection.mjs';

dotenv.config();
const router = express.Router();


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

export default router;