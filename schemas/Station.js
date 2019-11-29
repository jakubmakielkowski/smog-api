const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema(
  {
    stationId: String,
    location: {
      latitude: Number,
      longitude: Number,
    },
    address: {
      city: String,
      street: String,
    },
    sponsor: {
      name: String,
      description: String,
      logo: String,
      link: String,
    },
    source: String,
    level: String,
    dateOfInsertion: Date,
  },
);

const StationModel = mongoose.model('Station', StationSchema);

module.exports = StationModel;
