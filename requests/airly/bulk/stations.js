require('dotenv').config()

const client = require('../../../utils/database/client')
const Station = require('../../../schemas/Station.js')
const { fetchInstallations } = require('../helpers/api.js')

const getStations = async () => {
  const installationsList = await fetchInstallations()

  // 3. Add stations to database
  for (let i = 0; i < installationsList.length; i++) {
    process.stdout.write(`Get Stations (Airly) - adding to database... ${i + 1}/${installationsList.length}`)

    const installation = installationsList[i]

    // If sponsor is NOT GIOS and location is Poland
    if (installation.sponsor.id !== 11 && installation.address.country === 'Poland') {
      const { id, location } = installation
      const { city, street } = installation.address

      const station = new Station({
        stationId: `Airly-${id}`,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        address: {
          city,
          street
        },
        source: 'Airly'
      })

      if (installation.sponsor.id !== 556) {
        station.sponsor = {
          name: installation.sponsor.name,
          description: installation.sponsor.description,
          logo: installation.sponsor.logo,
          link: installation.sponsor.link
        }
      }

      // Insert station to db
      await client.db.collection(process.env.DATABASE_COL_STATIONS).updateOne(
        { stationId: station.stationId },
        {
          $set: {
            location: station.location,
            address: station.address,
            sponsor: station.sponsor,
            source: station.source
          }
        },
        { upsert: true }
      )
    }

    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  }

  process.stdout.write('Get Stations (Airly) - succedeed')
}

getStations()

module.exports = getStations
