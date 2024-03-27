import { XMLParser } from 'fast-xml-parser'
import weatherStations from '../weather-stations.json'
import { getDistance } from '~/utils/get_distance'

type GetWeatherUrlOptions = {
  /**
   * Calculates weather station(s) near to this location. Can be a district and municipality separated by a comma.
   */
  place?: string
  /**
   * Using coordinates you can instead get the nearest station to given coordinates.
   */
  coords?: { longitude: number; latitude: number }
  /**
   * Start time of the weather data. `startTime` is not guaranteed to be respected if no results exist for that time.
   */
  startTime: string
  /**
   * End time of the weather data. `endTime` must be later than `startTime`.
   * @default current time
   */
  endTime?: string
}

export const getWeatherUrl = (options: GetWeatherUrlOptions) => {
  if (options.coords && options.place) {
    throw new TypeError(
      'Cannot use both `place` and `coords` options at the same time.'
    )
  }

  const nearbyWeatherStations = weatherStations.sort((a, b) => {
    if (!options.coords) {
      return 0
    }

    const first = getDistance({
      from: { longitude: a.longitude, latitude: a.latitude },
      to: options.coords
    })
    const second = getDistance({
      from: { longitude: b.longitude, latitude: b.latitude },
      to: options.coords
    })

    return first - second
  })

  const parameters = new URLSearchParams({
    request: 'getFeature',
    storedquery_id: 'fmi::observations::weather::simple',
    maxlocations: '3',
    parameters: 't2m,SmartSymbol',
    starttime: options.startTime,
    endtime: options.endTime ?? new Date().toISOString()
  })

  if (options.coords) {
    parameters.append('fmisid', nearbyWeatherStations[0].fmisid.toString())
    parameters.append('fmisid', nearbyWeatherStations[1].fmisid.toString())
    parameters.append('fmisid', nearbyWeatherStations[2].fmisid.toString())
  }

  if (options.place) {
    parameters.append('place', options.place)
  }

  return new URL('https://opendata.fmi.fi/wfs?' + parameters.toString())
}

export const getWeatherObject = (xml: string) => {
  const parser = new XMLParser()
  const json = parser.parse(xml)

  // The API may return with an empty result, fail fast if that is the case
  if (!json['wfs:FeatureCollection']) {
    return
  }

  const members = [...json['wfs:FeatureCollection']['wfs:member']].map(
    member => member['BsWfs:BsWfsElement']
  )

  const weatherData: Record<string, Record<string, number>> = {}

  for (const member of members) {
    const time = member['BsWfs:Time']
    const parameter = member['BsWfs:ParameterName']
    const value = member['BsWfs:ParameterValue']

    if (!(time in weatherData)) {
      weatherData[time] = {}
    }

    weatherData[time][parameter] = value
  }

  const unfilteredKeys = Object.keys(weatherData)

  for (const time of unfilteredKeys) {
    // if (weatherData[time]['SmartSymbol'].toString() === 'NaN') {
    //   delete weatherData[time]
    //   continue
    // }

    if (weatherData[time]['t2m'].toString() === 'NaN') {
      delete weatherData[time]
    }
  }

  const weatherKeys = Object.keys(weatherData)

  // Calculate best time (nearest to now)
  const bestTime = weatherKeys.reduce((bestTime, time) => {
    const currentTime = Math.abs(new Date(time).getTime() - Date.now())
    const accumulator = Math.abs(new Date(bestTime).getTime() - Date.now())

    return currentTime < accumulator ? time : bestTime
  }, weatherKeys[0])

  const recentWeather = weatherData[bestTime]

  if (!recentWeather) {
    return
  }

  // t2m: Air temperature http://opendata.fmi.fi/meta?observableProperty=observation&param=t2m&language=eng
  const airTemperature = recentWeather['t2m']
  // SmartSymbol https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje (no documentation in English)
  const smartSymbol = recentWeather['SmartSymbol']

  return {
    airTemperature,
    smartSymbol,
    updatedAt: bestTime
  }
}

type FetchWeatherOptions = {
  /**
   * Calculates a weather station near to this location. Can be a district and municipality separated by a comma.
   */
  place?: string
  /**
   * Using coordinates you can instead get the nearest station to given coordinates.
   */
  coords?: { longitude: number; latitude: number }
}

export const fetchWeather = async (options: FetchWeatherOptions) => {
  const url = getWeatherUrl({
    place: options.place,
    coords: options.coords,
    startTime: '-1h'
  })

  const response = await fetch(url, {
    headers: { 'User-Agent': 'junat.live' },
    mode: 'cors'
  })
  const xml = await response.text()

  return getWeatherObject(xml)
}
