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
 * Special case 'sv' where 1 metre is just en metre same for kilometre.
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

export default {} as never
