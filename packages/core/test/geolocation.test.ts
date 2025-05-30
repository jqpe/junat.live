import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import en from '@junat/i18n/en.json'

import {
  getAccuracyWithUnit,
  getStationsSortedByDistance,
  normalizeRelativeTimestampMs,
} from '../src/geolocation'

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
    let testData = [...STATIONS] as const
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

/**
 * Helper to construct parameters for {@link getAccuracyWithUnit}
 */
function meters<T extends string>(accuracy: number, locale?: T) {
  return {
    accuracy,
    locale: locale ?? 'en',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: vi.fn(key => en[key]) as any,
  } as const
}

describe('get accuracy with unit', () => {
  it('returns accuracy in meters when accuracy is less than 1000', () => {
    expect(getAccuracyWithUnit(meters(35))).toStrictEqual('35 metres')
  })

  it('returns truncated accuracy when accuracy is less than 1000 and accuracy has decimal points', () => {
    expect(getAccuracyWithUnit(meters(121.212))).toStrictEqual('121 metres')
  })

  it('returns accuracy in kilometers when accuracy is greater than or equal to 1000 meters', () => {
    expect(getAccuracyWithUnit(meters(1000))).toStrictEqual('1 kilometre')
    expect(getAccuracyWithUnit(meters(2002))).toStrictEqual('2 kilometres')
  })

  it('returns accuracy in metre (singular) if truncated accuracy is equal to 1', () => {
    expect(getAccuracyWithUnit(meters(1.5))).toStrictEqual('1 metre')
  })
})

describe('normalize timestamp ms', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(Date.now())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when timestamp is right now and in spec format', () => {
    // Actual timestamp from Chrome console
    const timestamp = 1_719_662_140_861
    // Time this timestamp was recorded
    vi.setSystemTime('2024-06-29T11:55:40.861Z')

    // Relative time (in milliseconds)
    expect(normalizeRelativeTimestampMs(timestamp)).toBe(0)
  })

  it('returns 0 when timestamp is right now and in safari format', () => {
    // Actual timestamp from Safari console
    const timestamp = 741_355_175_332
    // Time this timestamp was recorded
    vi.setSystemTime('2024-06-29T11:59:35.332Z')

    // Relative time (in milliseconds)
    expect(normalizeRelativeTimestampMs(timestamp)).toBe(0)
  })
})
