import { getDistance } from '../../../utils/get_distance';

/**
 * From a list of stations, return the station nearest to position.
 */
export const getNearestStation = <
  T extends { longitude: number; latitude: number }
>(
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
