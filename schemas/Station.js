const mongoose = require("mongoose");

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

module.exports = mongoose.model("Station", StationSchema);
