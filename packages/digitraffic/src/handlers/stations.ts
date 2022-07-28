import type { LocalizedStation, Station } from '../types/station.js'

import { tweakStationNames } from '../utils/tweak_station_names.js'

import i18n from '../data/i18n.json'

import { createHandler, HandlerOptions } from '../base/create_handler.js'
import { createFetch } from '../base/create_fetch.js'

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

export interface GetStationsOptions extends HandlerOptions {
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
}

export interface GetStationsOptionsWithLocale extends GetStationsOptions {
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
   */
  locale: 'fi' | 'sv' | 'en' | i18nTuple
}

export interface GetStations {
  <T = Station[] | undefined>(
    options?: GetStationsOptions & {
      locale?: never
    }
  ): Promise<T>
  <T extends LocalizedStation[] | undefined>(
    options?: GetStationsOptionsWithLocale
  ): Promise<T>
}

type LocaleOptions =
  | { locale: GetStationsOptionsWithLocale['locale'] }
  | { locale: undefined }

const localizeStations = ({
  locales,
  localizedStations,
  stations
}: {
  locales: Required<i18nTuple>
  localizedStations: LocalizedStation[]
  stations: Station[]
}) => {
  for (const locale of locales) {
    for (const [i, station] of localizedStations.entries()) {
      const finnishStationName = stations[i].stationName

      localizedStations[i].stationName[locale] =
        locale === 'fi'
          ? finnishStationName
          : getLocalizedStation(locale, station, finnishStationName)
    }
  }

  return localizedStations
}

const cloneStations = (stations: Station[]) => {
  return structuredClone(stations).map(station => {
    return {
      ...station,
      stationName: {}
    }
  }) as LocalizedStation[]
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
    i18n[locale].find(s => s.stationShortCode === station.stationShortCode)
      ?.stationName || fallback
  )
}
const stationsHandler: GetStations = async ({
  betterNames = true,
  includeNonPassenger = true,
  omitInactive = true,
  signal,
  ...localeOptions
}: GetStationsOptions | GetStationsOptionsWithLocale = {}) => {
  let stations = await createFetch<Station[]>('/metadata/stations', { signal })

  if (omitInactive) {
    stations = stations?.filter(
      station => !inactiveStationShortCodes.includes(station.stationShortCode)
    )
  }

  if (!includeNonPassenger) {
    stations = stations?.filter(station => station.passengerTraffic)
  }

  const locale = (localeOptions as LocaleOptions)?.['locale']

  if (stations && locale) {
    const locales = [locale].flat().filter(Boolean) as ['fi', 'en', 'sv']
    const localizedStations = localizeStations({
      locales,
      localizedStations: cloneStations(stations),
      stations
    })

    return betterNames
      ? tweakStationNames(localizedStations, locales)
      : localizedStations
  }

  if (!stations || !betterNames) return stations

  return tweakStationNames(stations)
}

export const fetchStations = createHandler(stationsHandler)
