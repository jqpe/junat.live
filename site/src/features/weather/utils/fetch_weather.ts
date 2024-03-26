// Contains functionality for fetching weather data from the FMI API.
// The code makes the following assumptions:
// 1. We only want to see the most recent data for the past hour
// 2. We only want to see the weather data for one location

// TODO: write test cases for NaN values in response objects
// write test cases for empty FeatureCollection

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
    maxlocations: '1',
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

  const weatherData: Record<string, number> = {}

  for (const member of members) {
    const parameter = member['BsWfs:ParameterName']
    const value = member['BsWfs:ParameterValue']

    weatherData[parameter] = value
  }

  // t2m: Air temperature http://opendata.fmi.fi/meta?observableProperty=observation&param=t2m&language=eng
  const airTemperature = weatherData['t2m']
  // n_man: Cloudiness http://opendata.fmi.fi/meta?observableProperty=observation&param=n_man&language=eng
  const cloudiness = weatherData['n_man']
  // SmartSymbol https://www.ilmatieteenlaitos.fi/latauspalvelun-pikaohje (no documentation in English)
  const smartSymbol = weatherData['SmartSymbol']
  // r_1h: Precipitation amount last hour http://opendata.fmi.fi/meta?observableProperty=observation&param=r_1h&language=eng
  const precipitation = weatherData['r_1h']
  // ri_10min: Precipitation intensity last 10 minutes http://opendata.fmi.fi/meta?observableProperty=observation&param=ri_10min&language=eng
  const precipitationIntensity = weatherData['ri_10min']

  return {
    airTemperature,
    cloudiness,
    smartSymbol,
    precipitation,
    precipitationIntensity
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
