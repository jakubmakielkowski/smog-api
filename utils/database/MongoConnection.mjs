import dotenv from 'dotenv';
import { default as mongodb } from "mongodb";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const MongoConnection = MongoClient.connect(process.env.DATABASE_URL_DEV, {
	useNewUrlParser: true, useUnifiedTopology: true
});

export default MongoConnection;