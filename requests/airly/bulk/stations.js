require('dotenv').config()

const { client, initializeClient } = require('../../../utils/database/client')
const Station = require('../../../schemas/Station.js')
const { fetchInstallations } = require('../helpers/api.js')

const getStations = async () => {
  process.stdout.write('\n Connecting with database...')
  await initializeClient()

  process.stdout.write('\nGet Stations (GIOS) - fetching data from API...')
  const installationsList = await fetchInstallations()

  for (let i = 0; i < installationsList.length; i++) {
    process.stdout.write(`Get Stations (Airly) - adding to database... ${i + 1}/${installationsList.length}`)

    const installation = installationsList[i]

    // get only Polish and not GIOS redundant stations
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
  process.exit()
}

getStations()

module.exports = getStations
