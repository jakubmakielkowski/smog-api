import dotenv from 'dotenv';
import express from "express";

import stations from "./routes/stations.mjs";
import qualityIndices from "./routes/qualityIndices";
import measurements from "./routes/measurements";

dotenv.config();
const app = express();

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Methods', "*");
	res.setHeader('Access-Control-Allow-Headers', "*");
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use("/stations", stations);
app.use("/qualityIndices", qualityIndices);
app.use("/measurements", measurements);

app.listen(process.env.SERVER_PORT_DEV || 8080, () =>
	console.log(`Example app listening on ${process.env.SERVER_PORT_DEV || 8080}!`),
);