require('dotenv').config();

const MongoConnection = require('../../utils/database/MongoConnection.js');
const QualityIndex = require('../../schemas/QualityIndex.js');
const { idToNumber } = require('../../utils/api/id.js');
const { fetchMeasurements } = require('./api/fetch.js');

const mapDescription = (description) => {
  switch (description) {
    case 'VERY_LOW': return 'Bardzo dobry';
    case 'LOW': return 'Dobry';
    case 'MEDIUM': return 'Umiarkowany';
    case 'HIGH': return 'Zły';
    case 'VERY_HIGH': return 'Bardzo zły';
    default: return 'Bardzo zły';
  }
};

const addQualityIndex = async (stationId) => {
  // Connect with database
  let database; let
    client;
  try {
    client = await MongoConnection;
    database = client.db(process.env.DATABASE_NAME);
  } catch (error) {
    console.log(error);
  }

  let qualityIndexData;
  try {
    qualityIndexData = await fetchMeasurements(idToNumber(stationId));
  } catch (error) {
    console.log(error);
  }

  let level;
  try {
    level = qualityIndexData.current.indexes[0].level;

    const qualityIndex = new QualityIndex({
      stationId,
      level: mapDescription(level),
      dateOfInsertion: new Date(),
    });

    await database.collection('Stations').updateOne(
      { stationId: qualityIndex.stationId },
      {
        $set: {
          level: qualityIndex.level,
          dateOfInsertion: qualityIndex.dateOfInsertion,
        },
      },
      { upsert: true },
    );
    process.stdout.write('Get QualityIndex (Airly) - succedeed');
    return qualityIndex;
  } catch (error) {
    process.stdout.write('Get QualityIndex (Airly) - failed');
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = addQualityIndex;
