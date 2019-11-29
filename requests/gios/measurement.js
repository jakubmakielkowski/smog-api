require('dotenv').config();

const MongoConnection = require('../../utils/database/MongoConnection.js');const Measurement = require('../../schemas/Measurement.js');
const { idToNumber } = require('../../utils/api/id.js');
const { fetchSensor, fetchMeasurement } =  require('./api/fetch.js');

// Adds measurement data to database
const addMeasurement = async (stationId) => {

	// 1. Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	// 2. Fetch sensors
	let sensorIds;
	try {
		const sensorList = await fetchSensor(idToNumber(stationId));
		sensorIds = sensorList.map(sensor => sensor.id);
	} catch (error) {
		console.log(error);
	}


	// 3. For every sensor id, fetch its measurement data

	const measurement = new Measurement({
		stationId: stationId,
		dateOfInsertion: new Date(),
		measurements: []
	});

	for (let i = 0; i < sensorIds.length - 1; i++) {
		try {
			const measurementData = await fetchMeasurement(sensorIds[i]);
			const { key, values } = measurementData;

			values.splice(24);
			// Pm2.5 to Pm25
			const paramKey = key.replace(".","");

			const current = {
				param: paramKey,
				historicValues: values
			}

			measurement.measurements.push(current);
		} catch (error) {
			console.log(error)
		}
	}

	await database.collection("Measurements").updateOne(
		{
			stationId: measurement.stationId
		},
		{
			$set: {
				measurements: measurement.measurements,
				dateOfInsertion: measurement.dateOfInsertion
			}
		},
		{ upsert: true }
	);

	process.stdout.write(`getMeasurements request succeeded`);
	client.close();
	return measurement;	
}

module.exports =addMeasurement;