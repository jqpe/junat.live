import type { i18nTuple } from './get_stations'
import type { LocalizedStation, Station } from '../types/station'

import 'core-js/actual/structured-clone.js'

export type Locale = 'fi' | 'sv' | 'en' | i18nTuple

interface TweakStationNames {
  <T extends Station[]>(stations: T): T
  <T extends LocalizedStation[]>(stations: Station[] | T, locales: Locale): T
}

/**
 * Replaces station names with more concise ones.
 *
 * Helsinki asema will be just Helsinki, same for Kerava, Järvenpää etc.
 */
export const tweakStationNames: TweakStationNames = (
  stations: Station[],
  locales?: Locale
) => {
  if (locales) {
    // @ts-expect-error Structured clone exists but isn't typed.
    const tweakedStations = structuredClone(stations) as LocalizedStation[]

    for (const locale of locales) {
      if (!locale) {
        continue
      }
      for (const station of tweakedStations) {
        switch (locale) {
          case 'fi':
            station.stationName = Object.defineProperty(
              station.stationName,
              'fi',
              { value: station.stationName.fi?.replace(/ asema/, '') }
            )
            break
          case 'en':
            station.stationName = Object.defineProperty(
              station.stationName,
              'en',
              { value: station.stationName.en?.replace(/ asema/, '') }
            )
            break
          case 'sv':
            station.stationName = Object.defineProperty(
              station.stationName,
              'sv',
              { value: station.stationName.sv?.replace(/ asema/, '') }
            )
            break
        }
      }
    }

    return tweakedStations
  }

  return stations.map(station =>
    Object.defineProperty(station, 'stationName', {
      value: station.stationName.replace(/ asema/, '')
    })
  )
}
