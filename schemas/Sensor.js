const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema(
	{
		stationId: Number,
		sensorId: Number,
		param: {
			code: String,
			name: String
		}
	}
);

module.exports = mongoose.model("Sensor", SensorSchema);
