import { StationDetailsFragment } from '~/generated/graphql'
import { Locale } from '~/types/common'

/**
 * @internal
 */
const tweak = (stationName: string) => stationName.replace(' asema', '')

/**
 * @internal
 */
export const translateStations = <
  T extends { stationName: string; stationShortCode: string }
>(
  stations: T[],
  i18n: Record<
    string,
    {
      [code: string]: string
    }
  >
): (T & { stationName: Record<Locale, string> })[] => {
  return stations.map(station => {
    const localizedStationNames: Record<string, string> = {
      fi: station.stationName
    }
    localizedStationNames.fi = station.stationName

    for (const locale of Object.keys(i18n)) {
      const name = i18n[locale][station.stationShortCode] || station.stationName
      localizedStationNames[locale] = tweak(name)
    }

    return { ...station, stationName: localizedStationNames }
  })
}

type Station = {
  countryCode: string
  stationName: string
  stationShortCode: string
  longitude: number
  latitude: number
}

/**
 * @internal
 */
export const normalizedStations = (stations: StationDetailsFragment[]) => {
  return <Station[]>stations.map(station => {
    return {
      countryCode: station.countryCode,
      stationName: station.name,
      stationShortCode: station.shortCode,
      longitude: station.location?.[0] as number,
      latitude: station.location?.[1] as number
    }
  })
}
