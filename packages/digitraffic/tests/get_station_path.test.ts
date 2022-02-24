import { getStationPath } from '../src/get_station_path'
import { describe, expect, it } from 'vitest'

import stations from './fixtures/stations.json'

describe('get station path', () => {
  it('replaces ä with a', () => {
    expect(getStationPath('Järvenpää')).toStrictEqual('jarvenpaa')
  })

  it('replaces any spaces or dashes with _', () => {
    expect(getStationPath('Pasila autojuna-asema')).toStrictEqual(
      'pasila_autojuna_asema'
    )
  })

  it('replaces ö with o', () => {
    expect(getStationPath('Isokyrö')).toStrictEqual('isokyro')
  })

  it('all station paths are uri safe', () => {
    for (const station of stations) {
      const encodedUri = encodeURI(getStationPath(station.stationName))

      expect(encodedUri).toStrictEqual(getStationPath(station.stationName))
    }
  })
})
