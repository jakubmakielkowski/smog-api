require('dotenv').config()

const client = require('../../utils/database/client')
const Station = require('../../schemas/Station.js')
const { fetchStations } = require('./api/fetch.js')

const getStations = async () => {
  // 2. Fetch stations data
  process.stdout.write('\nGet Stations (GIOS) - fetching data from API...')
  const stationsData = await fetchStations()

  // 3. Insert stations
  for (let i = 0; i < stationsData.length; i++) {
    process.stdout.write(`Get Stations (GIOS) - inserting to database... ${i + 1}/${stationsData.length}`)

    const stationData = stationsData[i]
    const { id, gegrLat, gegrLon, addressStreet } = stationData
    const { provinceName, districtName, communeName } = (stationData.city && stationData.city.commune) || {}

    const station = new Station({
      stationId: `GIOS-${id}`,
      location: {
        latitude: gegrLat,
        longitude: gegrLon
      },
      address: {
        province: provinceName || null,
        district: districtName || null,
        city: communeName || null,
        street: addressStreet || null
      },
      source: 'GIOS'
    })

    // Insert station to db
    await client.db.collection('Stations').updateOne(
      { stationId: station.stationId },
      {
        $set: {
          location: station.location,
          address: station.address,
          source: station.source
        }
      },
      { upsert: true }
    )

    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  }

  process.stdout.write('Get Stations (GIOS) succedeed')
}

getStations()

module.exports = getStations
