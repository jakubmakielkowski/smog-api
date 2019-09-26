import mongoose from "mongoose";

const StationSchema = new mongoose.Schema(
	{
		stationId: String,
		location: {
			latitude: Number,
			longitude: Number
		},
		address: {
			city: String,
			street: String
		},
		sponsor: {
			name: String,
			description: String,
			logo: String,
			link: String
		},
		source: String
	}
);

const StationModel = mongoose.model("Station", StationSchema);

export default StationModel;