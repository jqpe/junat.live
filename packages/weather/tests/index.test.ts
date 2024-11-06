import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchWeatherData, weatherDataToJson } from '../src'

describe('weather data fetching and parsing', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('should fetch weather data with default base URL', async () => {
    const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <wfs:FeatureCollection timeStamp="2024-11-06T08:25:20Z" numberReturned="1" numberMatched="1" xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:BsWfs="http://xml.fmi.fi/schema/wfs/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <wfs:member>
          <BsWfs:BsWfsElement gml:id="BsWfsElement.1.1.1">
            <BsWfs:Location>
              <gml:Point gml:id="BsWfsElementP.1.1.1" srsDimension="2" srsName="http://www.opengis.net/def/crs/EPSG/0/4326">
                <gml:pos>60.1699 24.9384</gml:pos>
              </gml:Point>
            </BsWfs:Location>
            <BsWfs:Time>2023-07-01T12:00:00Z</BsWfs:Time>
            <BsWfs:ParameterName>temperature</BsWfs:ParameterName>
            <BsWfs:ParameterValue>20.5</BsWfs:ParameterValue>
          </BsWfs:BsWfsElement>
        </wfs:member>
      </wfs:FeatureCollection>`

    ;(fetch as any).mockResolvedValueOnce({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await fetchWeatherData({
      time: 1688213400000,
      latitude: 60.1699,
      longitude: 24.9384,
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
    expect(result![0].ParameterValue).toBe(20.5)
  })

  it('should handle empty weather data response', async () => {
    const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <wfs:FeatureCollection timeStamp="2024-11-06T08:25:20Z" numberReturned="0" numberMatched="0" xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:BsWfs="http://xml.fmi.fi/schema/wfs/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      </wfs:FeatureCollection>`

    ;(fetch as any).mockResolvedValueOnce({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await fetchWeatherData({
      time: 1688213400000,
      latitude: 60.1699,
      longitude: 24.9384,
    })

    expect(result).toBe(null)
  })

  it('should correctly parse weather data to JSON with all parameters', () => {
    const mockFeatures = [
      {
        ParameterName: 'temperature',
        ParameterValue: '25.5',
        Time: '2023-07-01T12:00:00Z',
        Location: {
          Point: {
            pos: '60.1699 24.9384',
          },
        },
      },
      {
        ParameterName: 'WindSpeedMS',
        ParameterValue: '5.2',
        Time: '2023-07-01T12:00:00Z',
        Location: {
          Point: {
            pos: '60.1699 24.9384',
          },
        },
      },
      {
        ParameterName: 'SmartSymbol',
        ParameterValue: '1',
        Time: '2023-07-01T12:00:00Z',
        Location: {
          Point: {
            pos: '60.1699 24.9384',
          },
        },
      },
    ]

    const result = weatherDataToJson(mockFeatures)

    expect(result).toEqual({
      SmartSymbol: 1,
      WindSpeedMS: 5.2,
      temperature: 25.5,
      time: '2023-07-01T12:00:00Z',
      location: {
        latitude: 60.1699,
        longitude: 24.9384,
      },
    })
  })

  it('should handle custom base URL', async () => {
    const customBaseUrl = 'https://custom-weather-api.com'
    const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <wfs:FeatureCollection timeStamp="2024-11-06T08:25:20Z" numberReturned="1" numberMatched="1" xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:BsWfs="http://xml.fmi.fi/schema/wfs/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <wfs:member>
          <BsWfs:BsWfsElement gml:id="BsWfsElement.1.1.1">
            <BsWfs:Location>
              <gml:Point gml:id="BsWfsElementP.1.1.1" srsDimension="2" srsName="http://www.opengis.net/def/crs/EPSG/0/4326">
                <gml:pos>59.9139 10.7522</gml:pos>
              </gml:Point>
            </BsWfs:Location>
            <BsWfs:Time>2023-07-01T12:00:00Z</BsWfs:Time>
            <BsWfs:ParameterName>temperature</BsWfs:ParameterName>
            <BsWfs:ParameterValue>18.5</BsWfs:ParameterValue>
          </BsWfs:BsWfsElement>
        </wfs:member>
      </wfs:FeatureCollection>`

    ;(fetch as any).mockResolvedValueOnce({
      text: () => Promise.resolve(mockResponse),
    })

    const result = await fetchWeatherData({
      baseUrl: customBaseUrl,
      time: 1688213400000,
      latitude: 59.9139,
      longitude: 10.7522,
    })

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(customBaseUrl))
    expect(result).toHaveLength(1)
    expect(result![0].ParameterValue).toBe(18.5)
  })

  it('should round time to next 5 minutes', async () => {
    const mockResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <wfs:FeatureCollection timeStamp="2024-11-06T08:25:20Z" numberReturned="1" numberMatched="1" xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:BsWfs="http://xml.fmi.fi/schema/wfs/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <wfs:member>
          <BsWfs:BsWfsElement gml:id="BsWfsElement.1.1.1">
            <BsWfs:Location>
              <gml:Point gml:id="BsWfsElementP.1.1.1" srsDimension="2" srsName="http://www.opengis.net/def/crs/EPSG/0/4326">
                <gml:pos>60.1699 24.9384</gml:pos>
              </gml:Point>
            </BsWfs:Location>
            <BsWfs:Time>2023-07-01T12:05:00Z</BsWfs:Time>
            <BsWfs:ParameterName>temperature</BsWfs:ParameterName>
            <BsWfs:ParameterValue>22.0</BsWfs:ParameterValue>
          </BsWfs:BsWfsElement>
        </wfs:member>
      </wfs:FeatureCollection>`

    ;(fetch as any).mockResolvedValueOnce({
      text: () => Promise.resolve(mockResponse),
    })

    const time = new Date('2023-07-01T12:10:42Z').getTime()
    await fetchWeatherData({
      time,
      latitude: 60.1699,
      longitude: 24.9384,
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('2023-07-01T12:15:00.000Z')),
    )
  })
})
