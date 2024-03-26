import { XMLParser } from 'fast-xml-parser'

type GetWeatherUrlOptions = {
  /**
   * Calculates weather station(s) near to this location. Can be a district and municipality separated by a comma.
   */
  place: string
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
  const parameters = new URLSearchParams({
    request: 'getFeature',
    storedquery_id: 'fmi::observations::weather::simple',
    place: options.place,
    maxlocations: '3',
    parameters: 't2m,n_man,SmartSymbol,r_1h,ri_10min',
    starttime: options.startTime,
    endtime: options.endTime ?? new Date().toISOString()
  })
  return new URL('https://opendata.fmi.fi/wfs?' + parameters.toString())
}

export const getWeatherObject = (xml: string) => {
  const parser = new XMLParser()
  const json = parser.parse(xml)
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
    if (weatherData[time]['SmartSymbol'].toString() === 'NaN') {
      delete weatherData[time]
      continue
    }

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

  // t2m: Air temperature http://opendata.fmi.fi/meta?observableProperty=observation&param=t2m&language=eng
  const airTemperature = recentWeather['t2m']
  // n_man: Cloudiness http://opendata.fmi.fi/meta?observableProperty=observation&param=n_man&language=eng
  const cloudiness = recentWeather['n_man']
  // SmartSymbol https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje (no documentation in English)
  const smartSymbol = recentWeather['SmartSymbol']
  // r_1h: Precipitation amount last hour http://opendata.fmi.fi/meta?observableProperty=observation&param=r_1h&language=eng
  const precipitation = recentWeather['r_1h']
  // ri_10min: Precipitation intensity last 10 minutes http://opendata.fmi.fi/meta?observableProperty=observation&param=ri_10min&language=eng
  const precipitationIntensity = recentWeather['ri_10min']

  return {
    airTemperature,
    cloudiness,
    smartSymbol,
    precipitation,
    precipitationIntensity,
    updatedAt: bestTime
  }
}

type FetchWeatherOptions = {
  /**
   * Calculates a weather station near to this location. Can be a district and municipality separated by a comma.
   */
  place: string
}

export const fetchWeather = async (options: FetchWeatherOptions) => {
  const hourBeforeNow = new Date()
  hourBeforeNow.setHours(hourBeforeNow.getHours() - 1)

  const url = getWeatherUrl({
    place: options.place,
    startTime: hourBeforeNow.toISOString()
  })

  const response = await fetch(url, {
    headers: { 'User-Agent': 'junat.live' },
    mode: 'cors'
  })
  const xml = await response.text()

  return getWeatherObject(xml)
}
