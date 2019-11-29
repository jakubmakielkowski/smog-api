require('dotenv').config();

const QualityIndex = require('../../schemas/QualityIndex.js');
const MongoConnection = require('../../utils/database/MongoConnection.js');
const { idToNumber } = require('../../utils/api/id.js');
const { fetchQualityIndex } = require('./api/fetch.js');

const getQualityIndex = async (stationId) => {
  // 1. Connect with database
  let database; let
    client;
  try {
    client = await MongoConnection;
    database = client.db(process.env.DATABASE_NAME);
  } catch (error) {
    console.log(error);
  }

  let qualitySensorData;
  try {
    qualitySensorData = await fetchQualityIndex(idToNumber(stationId));
  } catch (error) {
    console.log(error);
  }

  const {
    stIndexLevel,
  } = qualitySensorData || {};

  const qualityIndex = new QualityIndex({
    stationId,
    level: stIndexLevel && stIndexLevel.indexLevelName,
    dateOfInsertion: new Date(),
  });

  database.collection('Stations').updateOne(
    { stationId: qualityIndex.stationId },
    {
      $set: {
        level: qualityIndex.level,
        dateOfInsertion: qualityIndex.dateOfInsertion,
      },
    },
    { upsert: true },
  );

  process.stdout.write('getQualityIndex succedeed\n');
  client.close();
  return qualityIndex;
};

module.exports = getQualityIndex;
