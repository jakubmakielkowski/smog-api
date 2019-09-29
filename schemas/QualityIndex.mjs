import mongoose from "mongoose";

const QualityIndexSchema = new mongoose.Schema(
	{
		stationId: String,
		level: String,
		dateOfInsertion: Date
	}
);

const QualityIndexModel =  mongoose.model("QualityIndex", QualityIndexSchema);

export default QualityIndexModel;