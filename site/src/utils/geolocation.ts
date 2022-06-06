import type { NextRouter } from 'next/router'
import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import { getStationPath } from '@junat/digitraffic/utils'

import getNearestStation, {
  sortStationsByDistance
} from '@utils/get_nearest_station'

interface HandleGeolocationPosition {
  /**
   * When accuracy is sufficient (less than 1km) get the nearest station and push the route to that station.
   *
   * Route wont be pushed if the accuracy is bad.
   *
   * @returns void if accuracy is sufficient, otherwise a list of stations sorted by their distance to position.
   */
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: { stations: TStation[]; router: NextRouter }
  ): void | TStation[]
  <TStation extends LocalizedStation | Station>(
    position: GeolocationPosition,
    opts: {
      stations: TStation[]
      router: NextRouter
      locale: 'fi' | 'en' | 'sv'
    }
  ): void | TStation[]
}

export const handleGeolocationPosition: HandleGeolocationPosition = (
  position,
  opts
) => {
  if (!position) {
    return
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
    opts.router.push(`/${getStationPath(nearestStation.stationName)}`)
    return
  }

  if (!('locale' in opts)) {
    return
  }

  opts.router.push(getStationPath(nearestStation.stationName[opts.locale]))
}
