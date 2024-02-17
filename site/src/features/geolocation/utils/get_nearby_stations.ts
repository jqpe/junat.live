import type { Locale } from '@typings/common'

import { getNearestStation } from './get_nearest_station'
import { sortStationsByDistance } from './sort_stations_by_distance'

interface Station {
  latitude: number
  longitude: number
}

interface GetNearbyStationsProps {
  <T extends Station>(
    position: GeolocationPosition,
    opts: { stations: T[]; locale?: Locale }
  ): T[]
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

  return sortStationsByDistance<(typeof opts.stations)[number]>(opts.stations, {
    ...position,
    coords: {
      ...position.coords,
      latitude: nearestStation.latitude,
      longitude: nearestStation.longitude
    }
  })
}
