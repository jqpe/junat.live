import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import {
  getNearestStation,
  sortStationsByDistance
} from '@utils/get_nearest_station'

interface GetNearbyStationsProps {
  /**
   * If position data was accurate to 1000 meters return the nearest station.
   * Otherwise return stations sorted by their distance to `position`.
   */
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: { stations: TStation[] }
  ): TStation | TStation[]
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: {
      stations: TStation[]
      locale: 'fi' | 'en' | 'sv'
    }
  ): TStation | TStation[]
}

export const getNearbyStations: GetNearbyStationsProps = (position, opts) => {
  if (!position) {
    throw new TypeError('`position` parameter is required but omitted here.')
  }

  const nearestStation = getNearestStation<typeof opts.stations[number]>(
    opts.stations,
    position
  )

  const poorAccuracy = position.coords.accuracy > 1000

  if (poorAccuracy) {
    return sortStationsByDistance<typeof opts.stations[number]>(opts.stations, {
      ...position,
      coords: {
        ...position.coords,
        latitude: nearestStation.latitude,
        longitude: nearestStation.longitude
      }
    })
  }

  return nearestStation
}
