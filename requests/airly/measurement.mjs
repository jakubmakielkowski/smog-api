import dotenv from 'dotenv';

import MongoConnection from '../../utils/database/MongoConnection.mjs';
import Measurement from '../../schemas/Measurement.mjs';
import { idToNumber } from '../../utils/api/id.mjs';
import { fetchMeasurements } from './api/fetch.mjs';

dotenv.config();

const defaultParams = ["PM10", "PM25", "C6H6", "CO", "SO2", "NO2", "O3"];

const addMeasurement = async (stationId) => {

	// Connect with database
	let database, client;
	try {
		client = await MongoConnection;
		database = client.db(process.env.DATABASE_NAME);
	} catch (error) {
		console.log(error);
	}

	let measurementData;
	try {
		measurementData = await fetchMeasurements(idToNumber(stationId));
	} catch (error) {
		console.log(error);
	}

	try {
		const measurement = new Measurement({
			stationId: stationId,
			dateOfInsertion: new Date()
		});

		measurementData.history.splice(24);
		measurementData.forecast.splice(24);

		const history = measurementData.history;
		const forecast = measurementData.forecast;

		const params = history[0].values.filter(value => defaultParams.find(param => param === value.name));
		const paramNames = params.map(param => param.name);

		const measurements = [];
		paramNames.forEach(param => {
			const historicValues = [];
			history.forEach(element => {
				try {
					const value = element.values.find(value => value.name === param).value;
					historicValues.push({
						date: element.fromDateTime,
						value: value
					});
				} catch (error) {

				}
			});

			const forecastValues = [];
			forecast.forEach(element => {
				const value = element.values.find(value => value.name === param).value;
				forecastValues.push({
					date: element.fromDateTime,
					value: value
				});
			});

			measurements.push({
				param: param,
				historicValues: historicValues,
				forecastValues: forecastValues
			});
		});

		measurement.measurements = measurements;

		await database.collection("Measurements").updateOne(
			{ stationId: measurement.stationId },
			{
				$set: {
					measurements: measurement.measurements,
					dateOfInsertion: measurement.dateOfInsertion
				}
			},
			{ upsert: true }
		);
		client.close();
		process.stdout.write(`Get QualityIndex (Airly) - succedeed`);
		return measurement;
	} catch (error) {
		process.stdout.write(`Get QualityIndex (Airly) - failed`);
		console.log(error);
	} finally {
		client.close();
	}
}


export default addMeasurement;