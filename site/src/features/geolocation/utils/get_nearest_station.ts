import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import { getDistance } from './get_distance'

/**
 * From a list of stations, return the station nearest to position.
 */
export const getNearestStation = <T extends LocalizedStation | Station>(
  stations: T[],
  position: Pick<GeolocationPosition, 'coords'>
): T => {
  const { latitude, longitude, accuracy } = position.coords

  return stations.reduce((prev, curr) => {
    const prevDistance = getDistance({
      from: {
        latitude,
        longitude
      },
      to: { latitude: prev.latitude, longitude: prev.longitude },
      accuracy
    })
    const currDistance = getDistance({
      from: {
        latitude,
        longitude
      },
      to: { latitude: curr.latitude, longitude: curr.longitude },
      accuracy: accuracy
    })

    return currDistance < prevDistance ? curr : prev
  })
}

/**
 * Sort a list of stations by their distance to position.
 */
export const sortStationsByDistance = <T extends Station | LocalizedStation>(
  stations: readonly T[],
  position: {
    coords: Pick<
      GeolocationPosition['coords'],
      'accuracy' | 'latitude' | 'longitude'
    >
  }
) => {
  const { longitude, latitude, accuracy } = position.coords

  return [...stations].sort((a, b) => {
    const aDistance = getDistance({
      from: {
        latitude,
        longitude
      },
      to: { latitude: a.latitude, longitude: a.longitude },
      accuracy
    })
    const bDistance = getDistance({
      from: {
        latitude,
        longitude
      },
      to: { latitude: b.latitude, longitude: b.longitude },
      accuracy
    })

    return aDistance - bDistance
  })
}
