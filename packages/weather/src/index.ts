// Adapted from https://github.com/HSLdevcom/digitransit-ui/blob/53d128ece199dc0040720f240993aebd66775909/app/util/apiUtils.js#L44
// License EUPL v1.2 https://github.com/HSLdevcom/digitransit-ui/blob/v3/LICENSE-EUPL.txt

import { XMLParser } from 'fast-xml-parser'

interface WeatherOptions {
  baseUrl?: string
  time: number
  latitude: number
  longitude: number
}

const DEFAULT_BASE_URL = `https://opendata.fmi.fi/wfs?${new URLSearchParams({
  service: 'WFS',
  version: '2.0.0',
  request: 'getFeature',
  storedquery_id: 'fmi::forecast::harmonie::surface::point::simple',
  timestep: '5',
  parameters: 'temperature,WindSpeedMS,SmartSymbol',
})}`

export async function fetchWeatherData(options: WeatherOptions) {
  const fiveMinutesMs = 60 * 5 * 1000
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  const t = fiveMinutesMs * Math.ceil(options.time / fiveMinutesMs)
  const searchTime = new Date(t).toISOString()
  const response = await fetch(
    `${baseUrl}&${new URLSearchParams({
      latlon: `${options.latitude},${options.longitude}`,
      starttime: searchTime,
      endtime: searchTime,
    })}`,
  )

  const str = await response.text()
  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true,
  })
  const json = parser.parse(str)
  const members = json.FeatureCollection.member

  if (!members) {
    return null
  }

  return (Array.isArray(members) ? members : [members]).map(
    elem => elem.BsWfsElement,
  )
}

type JsonResult = {
  SmartSymbol: number
  WindSpeedMS: number
  temperature: number
  time: string
  location: { latitude: number; longitude: number }
}

export function weatherDataToJson(features: Feature[]): JsonResult {
  const result: JsonResult = {
    SmartSymbol: 0,
    WindSpeedMS: 0,
    temperature: 0,
    time: '',
    location: { latitude: 0, longitude: 0 },
  }

  for (const feature of features) {
    result[feature.ParameterName] = Number(feature.ParameterValue)
  }

  result.time = features[0]!.Time
  const [lat, long] = features[0]!.Location.Point.pos.split(' ')
  result.location = { latitude: +lat!, longitude: +long! }

  return result
}
