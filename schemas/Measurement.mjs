import mongoose from "mongoose";

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

const MeasurementModel = mongoose.model("Measurement", Measurement);

export default MeasurementModel;