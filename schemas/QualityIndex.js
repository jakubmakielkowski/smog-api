const mongoose = require("mongoose");

const QualityIndexSchema = new mongoose.Schema(
	{
		stationId: Number,
		levels: {
			st: String,
			so2: String,
			no2: String,
			co: String,
			pm10: String,
			pm25: String,
			o3: String,
			c6h6: String
		},
		dateOfInsertion: Date
	}
);

module.exports = mongoose.model("QualityIndex", QualityIndexSchema);
