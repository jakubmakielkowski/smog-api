import mongoose from "mongoose";

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

const SensorModel = mongoose.model("Sensor", SensorSchema);

export default SensorModel;