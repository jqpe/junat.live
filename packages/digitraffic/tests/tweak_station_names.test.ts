import { describe, expect, it } from 'vitest'
import { tweakStationNames } from '../src/tweak_station_names'
import type { LocalizedStation, Station } from '../types/station'

import stations from './fixtures/stations.json'
import localizedStations from './fixtures/localizedStations.json'

describe('tweak station names', () => {
  const expectedTweaks = [
    // Before tweaking: x asema
    'Helsinki',
    'Järvenpää',
    'Kerava',
    'Hanko',
    'Kauklahti',
    'Joensuu',
    // Should retain these
    'Pasila autojuna-asema',
    'Lentoasema'
  ]

  it('removes asema from correct stations', () => {
    const tweakedStationNames = tweakStationNames(stations as Station[]).map(
      station => station.stationName
    )

    expect(tweakedStationNames).to.include.members(expectedTweaks)
  })

  it('works with localized stations', () => {
    const tweakedLocalStationNames = tweakStationNames(
      localizedStations as LocalizedStation[],
      'en'
    ).map(station => station.stationName)

    // The translations for Swedish and English don't have anything to be tweaked thus aren't tested here.
    for (const tweakedLocalStationName of tweakedLocalStationNames) {
      switch (tweakedLocalStationName) {
        case 'fi':
          expect(tweakedLocalStationName.fi).to.include.members(expectedTweaks)
          break
        case 'sv':
          expect(tweakedLocalStationName.sv).to.include.members(expectedTweaks)
          break
        case 'en':
          expect(tweakedLocalStationName.en).to.include.members(expectedTweaks)
          break
      }
    }
  })
})
