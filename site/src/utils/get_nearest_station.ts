import type { LocalizedStation, Station } from '@junat/digitraffic'

import getDistance from '@utils/get_distance'

export default function getNearestStation<T extends LocalizedStation | Station>(
  stations: T[],
  position: Pick<GeolocationPosition, 'coords'>
): T {
  return stations.reduce((prev, curr) => {
    if (
      getDistance({
        from: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        to: { latitude: curr.latitude, longitude: curr.longitude },
        accuracy: position.coords.accuracy
      }) <
      getDistance({
        from: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        to: { latitude: prev.latitude, longitude: prev.longitude },
        accuracy: position.coords.accuracy
      })
    ) {
      return curr
    }
    return prev
  })
}
