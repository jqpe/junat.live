const EARTH_RADIUS = 6_378_137
const toRadians = (degrees: number) => degrees * (Math.PI / 180)

// Math.acos only allows x ∈ [-1, 1]
const tweakAcos = (n: number) => {
  if (n > 1) return 1
  if (n < -1) return -1
  return n
}

/**
 * Returns an inaccurate position by calculating the distance between two points on a 2D plane.
 */
export const getDistance = ({
  from,
  to,
  accuracy = 1
}: {
  from: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
  to: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
  accuracy?: number
}) => {
  const [sinToLat, sinFromLat, cosToLat, cosFromLat, cosLongDifference] = [
    Math.sin(toRadians(to.latitude)),
    Math.sin(toRadians(from.latitude)),
    Math.cos(toRadians(to.latitude)),
    Math.cos(toRadians(from.latitude)),
    Math.cos(toRadians(from.longitude) - toRadians(to.longitude))
  ]

  const tweakedAcos = tweakAcos(
    sinToLat * sinFromLat + cosToLat * cosFromLat * cosLongDifference
  )

  const distance = Math.acos(tweakedAcos) * EARTH_RADIUS

  return Math.round(distance / accuracy) * accuracy
}
