const mongoose = require('mongoose');

const QualityIndexSchema = new mongoose.Schema(
  {
    stationId: String,
    level: String,
    dateOfInsertion: Date,
  },
);

const QualityIndexModel = mongoose.model('QualityIndex', QualityIndexSchema);

module.exports = QualityIndexModel;
