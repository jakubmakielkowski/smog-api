import dotenv from 'dotenv';
import { default as mongodb } from "mongodb";

dotenv.config();
const MongoClient = mongodb.MongoClient;
const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true });

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