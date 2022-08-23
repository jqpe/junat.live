import type { LocalizedStation, Station } from '../types/station.js'

import { createHandler, HandlerOptions } from '../base/create_handler.js'
import { createFetch } from '../base/create_fetch.js'

export const INACTIVE_STATIONS = ['HSI', 'HH', 'KIA', 'KÖ', 'LVT', 'NLÄ', 'PRV']

export interface GetStationsOptions extends HandlerOptions {
  /** Keep inactive stations.
   * @default false
   */
  keepInactive?: boolean
  /** Remove train station from some of the station names,
   * e.g. Helsinki asema will be just Helsinki.
   * @default false */
  betterNames?: boolean
  /** Omit stations that don't have passenger traffic, use {@link inactiveStations} to provide your own stations to omit
   * @default false
   */
  keepNonPassenger?: boolean
  /**
   * Defaults to {@link INACTIVE_STATIONS}
   */
  inactiveStations?: string[]
}

export type GetStationsOptionsWithLocales<Locale extends string> =
  GetStationsOptions & i18n<Locale>

export type StationMap = {
  [code: string]: string
}

type i18n<Locale extends string> = {
  i18n: Record<Locale, StationMap>
  /**
   * Whether to use `fi` as a fallback if `i18n` doesn't some station
   *
   * `stations[number].stationName[locale]` will always a string, default without proxy is string or undefined.
   */
  proxy?: boolean
}

async function stations(options?: GetStationsOptions): Promise<Station[]>
async function stations<Locale extends string>(
  options: GetStationsOptions & i18n<Locale> & { proxy?: false }
): Promise<LocalizedStation<Locale | 'fi'>[]>

async function stations<Locale extends string>(
  options: GetStationsOptions & i18n<Locale> & { proxy: true }
): Promise<LocalizedStation<Locale | 'fi', true>[]>
async function stations<Locale extends string = never>(
  options?: GetStationsOptions | GetStationsOptionsWithLocales<Locale>
) {
  let stations = await createFetch<Station[]>('/metadata/stations', {
    signal: options?.signal
  })

  if (!stations) return []

  if (options?.keepInactive !== true) {
    stations = stations.filter(
      station => !INACTIVE_STATIONS.includes(station.stationShortCode)
    )
  }

  if (!options) {
    return stations
  }

  if (!options.keepNonPassenger) {
    stations = stations.filter(station => station.passengerTraffic)
  }

  if (options.betterNames) {
    stations = stations.map(station => ({
      ...station,
      stationName: tweakIf(station.stationName, true)
    }))
  }

  if (options && 'i18n' in options) {
    // @ts-expect-error Map the original Finnish translations only, but specify `Locale` to be used below
    const localizedStations: LocalizedStation<'fi' | Locale>[] = stations.map(
      station => ({
        ...station,
        stationName: { fi: station.stationName }
      })
    )

    return localizedStations.map(station => {
      const locales = Object.keys(options.i18n) as Locale[]

      station = getLocalizedStationNames(
        locales,
        station,
        options.i18n,
        options.betterNames
      )

      if (options.proxy) {
        station.stationName = proxy<Locale>(station)
      }

      return station
    })
  }

  return stations
}

function proxy<Locale extends string = never>(
  station: LocalizedStation<Locale | 'fi', false>
): Record<Locale | 'fi', string | undefined> {
  return new Proxy(station.stationName, {
    get: (target, property) => {
      if (property in target && target[property as Locale] !== undefined) {
        return target[property as Locale]
      }

      if (station.stationName.fi) {
        return station.stationName.fi
      }
    }
  })
}

function getLocalizedStationNames<Locale extends string | 'fi'>(
  locales: Locale[],
  station: LocalizedStation<Locale>,
  map: Record<Locale, StationMap>,
  betterNames?: boolean
): LocalizedStation<string | 'fi'> {
  for (const locale of locales) {
    const shortCode = map[locale][station.stationShortCode]

    if (
      locale === 'fi' &&
      (typeof shortCode !== 'string' || shortCode === '')
    ) {
      continue
    }

    station.stationName[locale] = tweakIf(shortCode, betterNames !== false)
  }

  return station
}

function tweakIf<T extends string | undefined>(
  name?: T,
  shouldTweak?: boolean
) {
  return (name && shouldTweak ? name.replace(/ asema/, '') : name) as T
}

export const fetchStations = createHandler(stations)
