import type { LocalizedStation, Station } from '../types/station'

import { tweakStationNames } from '../utils/tweak_station_names.js'

import i18n from '../../data/i18n.js'
import { createHandler } from '../base/create_handler'

export const inactiveStationShortCodes = [
  'HSI',
  'HH',
  'KIA',
  'KÖ',
  'LVT',
  'NLÄ',
  'PRV'
]

/**
 * Locales supported by the Digitraffic package.
 */
export type i18nTuple = Partial<['fi', 'en', 'sv']>

export type GetStationsOptions = {
  /** Omit inactive stations from the list.
   * @default true
   */
  omitInactive?: boolean
  /** Remove train station from some of the station names,
   * e.g. Helsinki asema will be just Helsinki.
   * @default true */
  betterNames?: boolean
  /** Whether to include stations without passenger traffic
   * @default true
   */
  includeNonPassenger?: boolean
  /**
   * When defined, `stationName` is an object with given locale(s).
   *
   * - Note: When omitted, `stationName` is a string with the Finnish translation.
   *
   * To get a single locale, you can use `'fi' | 'sv' | 'en'` — for Finnish, Swedish and English, respectively —
   * and the resulting `stationName` property will have one of these keys.
   *
   * If passing multiple locales in an array (e.g. `['fi', 'en']`) the resulting `stationName` will have keys for these locales.
   *
   * #### TypeScript
   *
   * When using TypeScript, use the generic type `LocalizedStation[]` in front of the call signature. This requires `locale` to be defined.
   *
   * @example
   * ```ts
   * getStation<LocalizedStation[]>({locale: "fi"}) // OK
   *
   * getStation<LocalizedStation[]>({}) // ERROR: locale is required.
   * ```
   * If you don't pass any arguments (e.g. empty object as above), TypeScript will assume you're trying to get plain stations and complain
   * about `LocalizedStation[]` not matching `Station[]`.
   */
  locale?: 'fi' | 'sv' | 'en' | i18nTuple
}

export interface GetStationsOptionsWithLocale extends GetStationsOptions {
  locale: 'fi' | 'sv' | 'en' | i18nTuple
}

export interface GetStations {
  <T extends Station[]>({
    betterNames,
    includeNonPassenger,
    omitInactive
  }?: GetStationsOptions): Promise<T>
  <T extends LocalizedStation[]>({
    betterNames,
    includeNonPassenger,
    omitInactive,
    locale
  }: GetStationsOptionsWithLocale): Promise<T>
}

/**
 * @private
 */
const getLocalizedStation = (
  locale: 'en' | 'sv',
  station: LocalizedStation,
  fallback: string
) => {
  return (
    i18n[locale].find(
      svStation => svStation.stationShortCode === station.stationShortCode
    )?.stationName || fallback
  )
}
const stations: GetStations = async ({
  betterNames = true,
  includeNonPassenger = true,
  omitInactive = true,
  locale
}: GetStationsOptions = {}) => {
  const response = await fetch(
    'https://rata.digitraffic.fi/api/v1/metadata/stations'
  )
  let stations: Station[] = await response.json()

  if (omitInactive) {
    stations = stations.filter(
      station => !inactiveStationShortCodes.includes(station.stationShortCode)
    )
  }

  if (!includeNonPassenger) {
    stations = stations.filter(station => station.passengerTraffic)
  }

  if (locale) {
    const locales = [locale].flat().filter(Boolean) as ['fi', 'en', 'sv']
    const localizedStations = structuredClone<Station[]>(stations).map(
      station => Object.defineProperty(station, 'stationName', { value: {} })
    ) as unknown as LocalizedStation[]

    for (const locale of locales) {
      for (const [i, station] of localizedStations.entries()) {
        const finnishStationName = stations[i].stationName

        localizedStations[i].stationName[locale] =
          locale === 'fi'
            ? finnishStationName
            : getLocalizedStation(locale, station, finnishStationName)
      }
    }

    return betterNames
      ? tweakStationNames(localizedStations, locales)
      : localizedStations
  }

  return betterNames ? tweakStationNames(stations) : stations
}

export const getStations = createHandler(stations)
