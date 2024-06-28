import { describe, expect, it } from 'vitest'

import { getStationsSortedByDistance } from '../src/geolocation'

const STATIONS = [
  {
    stationName: 'Ainola',
    longitude: 25.101_494,
    latitude: 60.456_863,
  },
  {
    stationName: 'Saunakallio',
    longitude: 25.065_568,
    latitude: 60.487_305,
  },
  {
    stationName: 'Kerava',
    longitude: 25.106_028,
    latitude: 60.404_297,
  },
  {
    stationName: 'Järvenpää',
    longitude: 25.090_796,
    latitude: 60.473_684,
  },
  {
    stationName: 'Haarajoki',
    longitude: 25.133_82,
    latitude: 60.496_261,
  },
  {
    stationName: 'Purola',
    longitude: 25.050_225,
    latitude: 60.500_329,
  },
]

describe('get stations sorted by distance', () => {
  it('sorts stations by distance', () => {
    const [longitude, latitude] = [25.101_494, 60.456_863]

    const sorted = getStationsSortedByDistance({
      stations: STATIONS,
      position: {
        coords: { accuracy: 1, latitude, longitude },
      },
    })

    expect([sorted[0]?.longitude, sorted[0]?.latitude]).toStrictEqual([
      longitude,
      latitude,
    ])

    // 0 km
    expect(sorted[0]?.stationName).toStrictEqual('Ainola')
    // 1.9 km
    expect(sorted[1]?.stationName).toStrictEqual('Järvenpää')
    // 3.65 km
    expect(sorted[2]?.stationName).toStrictEqual('Saunakallio')
    // 4.73 km
    expect(sorted[3]?.stationName).toStrictEqual('Haarajoki')
    // 5.5 km
    expect(sorted[4]?.stationName).toStrictEqual('Purola')
    // 5.8 km
    expect(sorted[5]?.stationName).toStrictEqual('Kerava')
  })

  it('does not mutate the original array', () => {
    // eslint-disable-next-line prefer-const
    let testData = [...STATIONS]
    const originalTestData = Object.freeze(testData)

    getStationsSortedByDistance({
      stations: testData,
      position: { coords: Object.assign(testData[0], { accuracy: 1 }) },
    })

    expect(testData).toBe(originalTestData)
  })

  it('works with an empty array', () => {
    expect(() => {
      return getStationsSortedByDistance({
        stations: [],
        position: { coords: Object.assign(STATIONS[0], { accuracy: 1 }) },
      })
    }).not.toThrow()
  })
})
