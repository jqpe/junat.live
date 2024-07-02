/**
 * Constructs a platform agnostic deep link to Google Maps for navigation to [lat, long] via walking.
 * @see https://developers.google.com/maps/documentation/urls/get-started
 *
 * @returns encoded URL string
 */
export function googleMapsDirections(longitude: number, latitude: number) {
  const url = new URL('https://www.google.com/maps/dir/')
  url.searchParams.append('api', '1')
  url.searchParams.append('destination', [latitude, longitude].join(','))
  url.searchParams.append('travelmode', 'walking')

  return url.toString()
}
