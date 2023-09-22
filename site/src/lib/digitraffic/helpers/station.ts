import { LocalizedStation } from '../types'
import { Station } from '../queries/stations'

/**
 * @internal
 */
const tweak = (stationName: string) => stationName.replace(' asema', '')

/**
 * @internal
 */
export const translateStations = (
  stations: Station[],
  i18n: Record<
    string,
    {
      [code: string]: string
    }
  >
): LocalizedStation[] => {
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

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizedStations = (stations: any): Station[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (stations as any[]).map(station => {
    return {
      countryCode: station.countryCode,
      stationName: station.name,
      stationShortCode: station.shortCode,
      longitude: station.location[0],
      latitude: station.location[1]
    }
  })
}
