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
    const weatherData = getWeatherObject(xml)!

    expect(weatherData.airTemperature).toStrictEqual(3)
    expect(weatherData.cloudiness).toStrictEqual(8)
    expect(weatherData.smartSymbol).toStrictEqual(7)
    expect(weatherData.precipitation).toStrictEqual(0)
    expect(weatherData.precipitationIntensity).toStrictEqual(0)
    expect(weatherData.updatedAt).toBeDefined()
  })

  it('returns a weather object from XML with bad data', async () => {
    const xml = await readFile(
      './src/features/weather/tests/data/weather_bad_data.xml',
      'utf-8'
    )
    const weatherData = getWeatherObject(xml)!

    expect(weatherData.airTemperature).toStrictEqual(2.5)
    expect(weatherData.cloudiness).toStrictEqual(7)
    expect(weatherData.smartSymbol).toStrictEqual(6)
    expect(weatherData.precipitation).toStrictEqual('NaN')
    expect(weatherData.precipitationIntensity).toStrictEqual(0)
    expect(weatherData.updatedAt).toStrictEqual('2024-03-26T13:50:00Z')
  })

  it('may return undefined', async () => {
    const xml = await readFile(
      './src/features/weather/tests/data/weather_no_data.xml',
      'utf-8'
    )
    const weatherData = getWeatherObject(xml)

    expect(weatherData).toBeUndefined()
  })

  it('graciously quits upon empty feature collection', async () => {
    const xml = await readFile(
      './src/features/weather/tests/data/weather_empty_feature_collection.xml',
      'utf-8'
    )
    const weatherData = getWeatherObject(xml)

    expect(weatherData).toBeUndefined()
  })
})
