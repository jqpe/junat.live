import { readFile } from 'fs/promises'
import { getWeatherObject, getWeatherUrl } from '../utils/fetch_weather'

import { describe, expect, it } from 'vitest'

describe('get weather url', () => {
  it('generates correct weather URL', () => {
    const date = new Date().toISOString()
    const url = getWeatherUrl({
      place: 'Helsinki',
      startTime: date,
      endTime: date
    })

    expect(url.hostname).toStrictEqual('opendata.fmi.fi')
    expect(url.pathname).toStrictEqual('/wfs')

    expect(Array.from(url.searchParams.keys())).has.all.members([
      'request',
      'storedquery_id',
      'place',
      'maxlocations',
      'parameters',
      'starttime',
      'endtime'
    ])
  })
})

describe('get weather object', () => {
  it('returns a weather object from XML', async () => {
    const xml = await readFile(
      './src/features/weather/tests/data/weather.xml',
      'utf-8'
    )
    const weatherData = getWeatherObject(xml)

    expect(weatherData.airTemperature).toStrictEqual(3)
    expect(weatherData.cloudiness).toStrictEqual(8)
    expect(weatherData.smartSymbol).toStrictEqual(7)
    expect(weatherData.precipitation).toStrictEqual(0)
    expect(weatherData.precipitationIntensity).toStrictEqual(0)
    expect(weatherData.updatedAt).toBeDefined()
  })
})
