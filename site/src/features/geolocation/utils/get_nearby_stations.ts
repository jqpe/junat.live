import type { Locale } from '@typings/common'

import { getNearestStation } from './get_nearest_station'
import { sortStationsByDistance } from './sort_stations_by_distance'

interface GetNearbyStationsProps {
  /**
   * If position data was accurate to 1000 meters return the nearest station.
   * Otherwise return stations sorted by their distance to `position`.
   * Use `ignorePoorAccuracy` parameter to disable this behavior and always return an array.
   */
  <T extends { latitude: number; longitude: number }>(
    position: GeolocationPosition,
    opts: { stations: T[]; ignorePoorAccuracy?: boolean }
  ): T | T[]
  <T extends { latitude: number; longitude: number }>(
    position: GeolocationPosition,
    opts: {
      stations: T[]
      ignorePoorAccuracy?: boolean
      locale: Locale
    }
  ): T | T[]
}

export const getNearbyStations: GetNearbyStationsProps = (position, opts) => {
  if (!position) {
    throw new TypeError('`position` parameter is required but omitted here.')
  }

  if (opts.stations.length === 0) {
    return []
  }

  const nearestStation = getNearestStation<(typeof opts.stations)[number]>(
    opts.stations,
    position
  )

  const poorAccuracy = opts.ignorePoorAccuracy
    ? true
    : position.coords.accuracy > 1000

  if (poorAccuracy) {
    return sortStationsByDistance<(typeof opts.stations)[number]>(
      opts.stations,
      {
        ...position,
        coords: {
          ...position.coords,
          latitude: nearestStation.latitude,
          longitude: nearestStation.longitude
        }
      }
    )
  }

  return nearestStation
}
