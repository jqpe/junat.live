import type { GetTranslatedValue } from '@junat/core/i18n'

import { LOCALES } from './constants.js'

type Locale = (typeof LOCALES)[number]

interface AccuracyWithUnitOptions {
  accuracy: number
  locale: Locale
  t: GetTranslatedValue
}

type GetAccuracyWithUnit = (options: AccuracyWithUnitOptions) => string

/**
 * Returns truncated accuracy with an unit, one of meters or kilometers.
 * Special case 'sv' where 1 metre is just en metre, same for kilometre.
 *
 * @todo This API will be removed in the future when i18n supports plurals
 */
export const getAccuracyWithUnit: GetAccuracyWithUnit = options => {
  const { accuracy, locale, t } = options

  let [meters, kilometers] = [
    `${Math.trunc(accuracy)} ${t('metres')}`,
    `${Math.trunc(accuracy / 1000)} ${t('kilometres')}`,
  ]

  if (Math.trunc(accuracy) === 1) {
    meters =
      locale === 'sv' ? t('metre') : `${Math.trunc(accuracy)} ${t('metre')}`
  }
  if (Math.trunc(accuracy / 1000) === 1) {
    kilometers =
      locale === 'sv'
        ? t('kilometre')
        : `${Math.trunc(accuracy / 1000)} ${t('kilometre')}`
  }

  return accuracy < 1000 ? meters : kilometers
}

interface GetDistanceOptions {
  from: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
  to: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>
  accuracy?: number
}

type GetDistance = (options: GetDistanceOptions) => number

/**
 * Returns an inaccurate position by calculating the distance between two points on a 2D plane.
 */
export const getDistance: GetDistance = options => {
  const { from, to, accuracy = 1 } = options

  const EARTH_RADIUS_KM = 6_378_137
  const toRadians = (d: number) => d * (Math.PI / 180)
  const clampAcosInput = (n: number) => Math.max(-1, Math.min(1, n))

  const sin = {
    toLat: Math.sin(toRadians(to.latitude)),
    fromLat: Math.sin(toRadians(from.latitude)),
  }

  const cos = {
    toLat: Math.cos(toRadians(to.latitude)),
    fromLat: Math.cos(toRadians(from.latitude)),
    longDiff: Math.cos(toRadians(from.longitude) - toRadians(to.longitude)),
  }

  const input = clampAcosInput(
    sin.toLat * sin.fromLat + cos.toLat * cos.fromLat * cos.longDiff,
  )

  const distance = Math.acos(input) * EARTH_RADIUS_KM

  return Math.round(distance / accuracy) * accuracy
}

type Coords = { latitude: number; longitude: number }

interface SortStationsByDistanceOptions<T extends Coords> {
  stations: readonly T[]
  position: {
    coords: Pick<
      GeolocationPosition['coords'],
      'accuracy' | 'latitude' | 'longitude'
    >
  }
}

type SortStationsByDistance = <T extends Coords>(
  options: SortStationsByDistanceOptions<T>,
) => T[]

/**
 * Sort a list of stations by their distance to position.
 */
export const getStationsSortedByDistance: SortStationsByDistance = options => {
  const { position, stations } = options
  const { accuracy } = position.coords

  return stations.toSorted((a, b) => {
    const aDistance = getDistance({
      from: position.coords,
      to: { latitude: a.latitude, longitude: a.longitude },
      accuracy,
    })
    const bDistance = getDistance({
      from: position.coords,
      to: { latitude: b.latitude, longitude: b.longitude },
      accuracy,
    })

    return aDistance - bDistance
  })
}

/**
 * Normalizes a timestamp to return the number of milliseconds since the current time.
 * Adjusts for Safari's [non-standard Epoch](https://openradar.appspot.com/9246279) (January 1, 2001).
 * Does this without relying on user agents so it's (somewhat) stable.
 *
 *
 * ###### NOTE
 * This might return unexpected results if a geolocation timestamp returned by an user-agent that
 * conforms to the spec is older than a week (meaning GPS was last used more than a week ago)
 * This should be extremely uncommon (damn near impossible) so the normalization is sound in most cases.
 */
export function normalizeRelativeTimestampMs(timestamp: number) {
  let msdiff = Date.now() - timestamp

  const MS_IN_DAY = 24 * 60 * 60 * 1000
  // In Chrome and all browser that respect the spec it's unlikely we'd get
  // a location cached for an entire week
  const probablySafari = msdiff > 7 * MS_IN_DAY

  // Adjust for Safari's non-standard Epoch (January 1, 2001) see https://openradar.appspot.com/9246279
  if (probablySafari) {
    const safariEpochOffset = new Date('2001-01-01T00:00:00Z').getTime()
    const safariTimestamp = timestamp + safariEpochOffset

    msdiff = Date.now() - safariTimestamp
  }

  return msdiff
}

export default {} as never
