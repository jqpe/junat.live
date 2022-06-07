import { sortStationsByDistance } from '../../src/utils/get_nearest_station'

import stations from '../../mocks/data/stations.json'

import { it, expect, describe } from 'vitest'
import { Station } from '@junat/digitraffic/types'

describe('sort stations by distance', () => {
  it('sorts stations by distance', () => {
    const [longitude, latitude] = [25.101494, 60.456863]

    const sorted = sortStationsByDistance(stations as Station[], {
      coords: { accuracy: 1, longitude, latitude }
    })

    expect(sorted[0].stationName).toStrictEqual('Ainola')
    expect([sorted[0].longitude, sorted[0].latitude]).toStrictEqual([
      longitude,
      latitude
    ])

    // 1.9 km
    expect(sorted[1].stationName).toStrictEqual('Järvenpää asema')
    // 3.65 km
    expect(sorted[2].stationName).toStrictEqual('Saunakallio')
    // 4.73 km
    expect(sorted[3].stationName).toStrictEqual('Haarajoki')
    // 5.5 km
    expect(sorted[4].stationName).toStrictEqual('Purola')
    // 5.8 km
    expect(sorted[5].stationName).toStrictEqual('Kerava asema')
  })
})
