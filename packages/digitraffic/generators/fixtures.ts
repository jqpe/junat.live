import { getStations } from '../src/get_stations.js'
import fs from 'node:fs/promises'
import path from 'node:path'
;(async () => {
  const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures')
  const files = new Set(await fs.readdir(fixturesDir))

  if (!files.has('stations.json')) {
    const stations = await getStations({ omitInactive: false })

    await fs.writeFile(
      path.join(fixturesDir, 'stations.json'),
      JSON.stringify(stations)
    )
  }
  if (!files.has('nonInactiveStations.json')) {
    const nonInactiveStations = await getStations()

    await fs.writeFile(
      path.join(fixturesDir, 'nonInactiveStations.json'),
      JSON.stringify(nonInactiveStations)
    )
  }

  if (!files.has('nonPassengerStations.json')) {
    const nonPassengerStations = await getStations({
      includeNonPassenger: false
    })

    await fs.writeFile(
      path.join(fixturesDir, 'nonPassengerStations.json'),
      JSON.stringify(nonPassengerStations)
    )
  }

  if (!files.has('enStations.json')) {
    const enStations = await getStations({ locale: 'en' })

    await fs.writeFile(
      path.join(fixturesDir, 'enStations.json'),
      JSON.stringify(enStations)
    )
  }

  if (!files.has('svStations.json')) {
    const svStations = await getStations({ locale: 'sv' })

    await fs.writeFile(
      path.join(fixturesDir, 'svStations.json'),
      JSON.stringify(svStations)
    )
  }

  if (!files.has('localizedStations.json')) {
    const localizedStations = await getStations({ locale: ['fi', 'en', 'sv'] })

    await fs.writeFile(
      path.join(fixturesDir, 'localizedStations.json'),
      JSON.stringify(localizedStations)
    )
  }
})()
