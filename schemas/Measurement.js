const mongoose = require("mongoose");

const Measurement = new mongoose.Schema(
	{
		stationId: String,
		measurements: [{
			sensorId: Number,
			param: String,
			historicValues: [{
				date: Date,
				value: String
			}],
			forecastValues: [{
				date: Date,
				value: String
			}]
		}],
		dateOfInsertion: Date
	}
);

const MeasurementModel = mongoose.model("Measurement", Measurement);

module.exports =MeasurementModel;