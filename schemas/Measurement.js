const mongoose = require("mongoose");

const Measurement = new mongoose.Schema(
	{
		stationId: Number,
		sensorId: Number,
		param: String,
		values: [{
			date: Date,
			value: String
		}],
		dateOfInsertion: Date
	}
);

module.exports = mongoose.model("Measurement", Measurement);
