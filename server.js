require("dotenv").config();
const express = require("express");
const app = express();

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL_DEV);
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

const stations = require("./routes/stations");
const sensors = require("./routes/sensors");
const qualityIndices = require("./routes/qualityIndices");
const measurements = require("./routes/measurements");

app.use("/stations", stations);
app.use("/sensors", sensors);
app.use("/qualityIndices", qualityIndices);
app.use("/measurements", measurements);

app.listen(process.env.SERVER_PORT_DEV, () =>
	console.log(`Example app listening on ${process.env.SERVER_PORT_DEV}!`),
);