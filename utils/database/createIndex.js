import dotenv from 'dotenv';

import MongoConnection from './MongoConnection.mjs';

dotenv.config();

// Create stations index
const createIndex = async () => {
	const client = await MongoConnection;
	const db = client.db(process.env.DATABASE_NAME);
	
	db.collection(process.env.DATABASE_COL_STATIONS).createIndex({
		"address.city": "text",
		"address.street": "text"
	});
	
	console.log("Stations text index created");
}

createIndex();