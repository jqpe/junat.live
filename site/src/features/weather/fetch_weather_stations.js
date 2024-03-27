import fs from 'node:fs/promises'

const WEATHER_DATA_PATH = 'src/features/weather/weather-stations.json'

const fetchWeatherStations = async () => {
  const result = await fetch(
    'https://cdn.fmi.fi/weather-observations/metadata/all-finnish-observation-stations.fi.json'
  )
  const { items: stations } = await result.json()

  const final = stations
    .filter(station => station.groups === 'sää' && !station.ended)
    .map(station => ({
      longitude: station.x,
      latitude: station.y,
      name: station.name,
      fmisid: station.fmisid
    }))

  await fs
    .writeFile(WEATHER_DATA_PATH, JSON.stringify(final, null, 2) + '\n')
    .then(() => {
      console.log('wrote', final.length, 'items')
    })
}

await fetchWeatherStations()
