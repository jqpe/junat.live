import type * as GeoJSON from 'geojson'
import type { GpsLocation } from '@junat/digitraffic/types/gps_location'

import * as turf from '@turf/turf'

type GetGtfsIdOpts = {
  operatorShortCode: string
  departureShortCode: string
  arrivalShortCode: string
  trainNumber: number
  trainType: string
  commuterLineId?: string
  /**
   * Defaults to `10` (Finland regional trains); this can be a lot of things so it's recommended that you provide it from data
   *
   * For a full reference @see https://www.cit-rail.org/media/files/appendix_circular_letter_10_2021_list_of_codes_2021-05-17.pdf
   *
   * For example, it could be 3191 for Haapamäen museoveturiyhdistys ry
   */
  uicCode?: number
}

type GetGtfsid = (opts: GetGtfsIdOpts) => string

/**
 * Gets a Digitransit compatible gtfsid for given parameters.
 *
 * @see https://digitransit.fi/en/developers/apis/1-routing-api/stops/
 */
export const getGtfsId: GetGtfsid = opts => {
  /* 
  The format is FeedId:StopId

  For all available feeds see
  https://api.digitransit.fi/graphiql/finland/v1?query=%257B%250Afeeds%2520%257B%250A%2520%2520feedId%250A%2520%2520agencies%2520%257B%250A%2520%2520%2520%2520name%250A%2520%2520%257D%250A%257D%250A%257D
  HSL and digitraffic are the more interesting ones. Other feeds mainly serve transport modes other train rail.
  
  StopId is:
  - departure
  - arrival
  - commuter line id or train number (commuterLineId is to be used when available)
  - train type
  - uic

  e.g. digitraffic:HKI_HKI_P_HL_10, digitraffic:LVT_ÄKI_1921_MUS_3191, digitraffic:HKI_TPE_183_S_10...
  */

  if (!opts.trainNumber) {
    throw new TypeError('Can not determine gtfsid without trainNumber')
  }

  const operator: 'digitraffic' | 'HSL' =
    opts.operatorShortCode === 'hsl' ? 'HSL' : 'digitraffic'

  // https://en.wikipedia.org/wiki/List_of_UIC_country_codes#Table_of_codes
  const uicCode = opts.uicCode ?? 10

  return (
    `${operator}:` +
    [
      opts.departureShortCode,
      opts.arrivalShortCode,
      opts.commuterLineId || opts.trainNumber,
      opts.trainType,
      uicCode,
    ].join('_')
  )
}

/**
 * Calculates the bearing between the previous and next coordinates of a line string at the nearest point to the given coordinates.
 *
 * @returns The bearing in degrees, `null` if it can't be determined.
 */
export const getBearing = (
  geometry: { lon: number; lat: number }[],
  coords: GeoJSON.Feature<GeoJSON.Point>,
) => {
  if (!geometry || !coords) return null

  const lineString = turf.lineString(geometry.map(c => [c?.lon, c?.lat]))
  const currentPoint = turf.point(coords.geometry.coordinates)

  const {
    properties: { index },
  } = turf.nearestPointOnLine(lineString, currentPoint)

  const prevCoord = lineString.geometry.coordinates[Math.max(0, index - 1)]
  const nextCoord =
    lineString.geometry.coordinates[
      Math.min(lineString.geometry.coordinates.length - 1, index + 1)
    ]

  if (!prevCoord || !nextCoord) {
    console.error(
      'can not determine bearing, expected coordinates to be defined',
      { prevCoord, nextCoord },
    )
    return null
  }

  return turf.bearing(turf.point(prevCoord), turf.point(nextCoord))
}

/** Calculates the nearest point on a line string to a given location. */
export const getSnappedPoint = <
  T extends { trainLocations?: [{ location: GeoJSON.Position }] },
>(
  train: T,
  /** If `undefined` defaults to train.trainLocations[0].location */
  recentLocation: GpsLocation | undefined,
  lineStringCoordinates: GeoJSON.Position[],
) => {
  const initialPosition = train.trainLocations?.[0].location

  const long = recentLocation?.location.coordinates[0] ?? initialPosition?.[0]
  const lat = recentLocation?.location.coordinates[1] ?? initialPosition?.[1]

  if (!long || !lat) return null

  return turf.nearestPointOnLine(
    turf.lineString(lineStringCoordinates),
    turf.point([long, lat]),
  )
}

/** Generates a unique route ID for a given train. */
export const getRouteId = <
  T extends {
    compositions?: Array<{
      journeySections: Array<{
        startTimeTableRow: { station: { shortCode: string } }
        endTimeTableRow: { station: { shortCode: string } }
      }>
    }>
    timeTableRows: Array<{ stationShortCode: string }>
    operator: { shortCode: string; uicCode: string }
    trainType: string
    commuterLineID?: string
    trainNumber: number
  },
>(
  train: T,
): string | null => {
  const getShortCode = (key: 'endTimeTableRow' | 'startTimeTableRow') => {
    const index = key === 'startTimeTableRow' ? 0 : -1

    const fromJourney =
      train.compositions?.[index]?.journeySections?.[0]?.[key].station.shortCode

    const fromRows = train.timeTableRows.at(index)?.stationShortCode

    return fromJourney ?? fromRows
  }

  return train
    ? getGtfsId({
        departureShortCode: getShortCode('startTimeTableRow')!,
        arrivalShortCode: getShortCode('endTimeTableRow')!,
        operatorShortCode: train.operator.shortCode,
        uicCode: +train.operator.uicCode,
        trainType: train.trainType,
        commuterLineId: train.commuterLineID,
        trainNumber: train.trainNumber,
      })
    : null
}
