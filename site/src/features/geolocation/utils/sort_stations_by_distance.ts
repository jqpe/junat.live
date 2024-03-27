import { getDistance } from '../../../utils/get_distance';

/**
 * Sort a list of stations by their distance to position.
 */
export const sortStationsByDistance = <
  T extends { latitude: number; longitude: number }
>(
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
