import type { LocalizedStation, Station } from '../types/station.js'
import type { HandlerOptions } from '../base/handler.js'

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
  inactiveStations?: readonly string[]
}

export type GetStationsOptionsWithLocales<Locale extends string> =
  GetStationsOptions & i18n<Locale>

export type StationMap = {
  [code: string]: string
}

type i18n<Locale extends string> = {
  i18n: Record<Locale, StationMap>
  /**
   * Whether to use `fi` as a fallback if `i18n` doesn't contain some station.
   *
   * Finnish (fi) is provided by the API and is thus always available, regardless of if it's included in the output or not.
   *
   * `stations[number].stationName[locale]` will always a string, default without proxy is string or undefined.
   */
  proxy?: boolean
}

export async function fetchStations(
  options?: GetStationsOptions
): Promise<Station[]>
export async function fetchStations<Locale extends string>(
  options: GetStationsOptions & i18n<Locale> & { proxy?: false }
): Promise<LocalizedStation<Locale | 'fi'>[]>

export async function fetchStations<Locale extends string>(
  options: GetStationsOptions & i18n<Locale> & { proxy: true }
): Promise<LocalizedStation<Locale | 'fi', true>[]>
export async function fetchStations<Locale extends string = never>(
  options?: GetStationsOptions | GetStationsOptionsWithLocales<Locale>
) {
  let stations = await createFetch<Station[]>('/metadata/stations', {
    signal: options?.signal
  })

  if (!stations) return []

  if (options?.keepInactive !== true) {
    stations = stations.filter(
      station =>
        !(options?.inactiveStations || INACTIVE_STATIONS).includes(
          station.stationShortCode
        )
    )
  }

  if (!options) {
    return stations
  }

  if (!options.keepNonPassenger) {
    stations = stations.filter(station => station.passengerTraffic)
  }

  if (options.betterNames && !('i18n' in options)) {
    stations = stations.map(station => ({
      ...station,
      stationName: tweakIf(station.stationName, true)
    }))
  }

  if (options && 'i18n' in options) {
    const localizedStations: LocalizedStation<'fi'>[] = stations.map(
      station => ({
        ...station,
        stationName: Object.assign(
          { fi: station.stationName },
          Object.fromEntries(
            (Object.keys(options.i18n) as Locale[]).map(locale => {
              return [
                locale,
                tweakIf(
                  options.i18n[locale][station.stationShortCode] ||
                    (options.proxy || locale === 'fi'
                      ? station.stationName
                      : undefined),
                  options.betterNames
                )
              ]
            })
          )
        )
      })
    )

    return localizedStations
  }

  return stations
}

function tweakIf<T extends string | undefined>(
  name?: T,
  shouldTweak?: boolean
) {
  return (name && shouldTweak ? name.replace(/ asema/, '') : name) as T
}
