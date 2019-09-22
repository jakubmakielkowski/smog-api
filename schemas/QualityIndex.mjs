import mongoose from "mongoose";

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

const QualityIndexModel =  mongoose.model("QualityIndex", QualityIndexSchema);

export default QualityIndexModel;