import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import { getStationPath } from '@junat/digitraffic/utils'

import {
  getNearestStation,
  sortStationsByDistance
} from '@utils/get_nearest_station'

interface HandleGeolocationPosition {
  /**
   * When accuracy is sufficient (less than 1km) get the nearest station and return the route to that station.
   *
   * @returns a route string if accuracy is sufficient, otherwise a list of stations sorted by their distance to `position`.
   */
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: { stations: TStation[] }
  ): string | TStation[]
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: {
      stations: TStation[]
      locale: 'fi' | 'en' | 'sv'
    }
  ): string | TStation[]
}

export const handleGeolocationPosition: HandleGeolocationPosition = (
  position,
  opts
) => {
  if (!position) {
    throw new TypeError('`position` parameter is required but omitted here.')
  }

  const nearestStation = getNearestStation<typeof opts.stations[number]>(
    opts.stations,
    position
  )

  if (position.coords.accuracy > 1000) {
    return sortStationsByDistance<typeof opts.stations[number]>(opts.stations, {
      ...position,
      coords: {
        ...position.coords,
        latitude: nearestStation.latitude,
        longitude: nearestStation.longitude
      }
    })
  }

  if (typeof nearestStation.stationName === 'string') {
    return `/${getStationPath(nearestStation.stationName)}`
  }

  if (!('locale' in opts)) {
    throw new TypeError(
      "`stationName` wasn't a string and locale parameter wasn't supplied. " +
        'Locale parameter is required when stations is an array of localized stations.'
    )
  }

  return getStationPath(nearestStation.stationName[opts.locale])
}
