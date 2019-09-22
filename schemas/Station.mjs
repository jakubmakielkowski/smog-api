import mongoose from "mongoose";

const StationSchema = new mongoose.Schema(
	{
		stationId: Number,
		airlyId: Number,
		location: {
			latitude: Number,
			longitude: Number
		},
		address: {
			province: String,
			district: String,
			city: String,
			street: String
		}
	}
);

const StationModel = mongoose.model("Station", StationSchema);

export default StationModel;