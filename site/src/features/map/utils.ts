import type { TrainCategory } from '@junat/digitraffic/types'

type GetGtfsIdOpts = {
  operatorShortCode: string
  departureShortCode: string
  arrivalShortCode: string
  commuterLineId?: string
  trainNumber: number
  trainCategory: TrainCategory
  /**
   * @default 10 (Finland)
   */
  uicCode?: number
}
type GetGtfsid = (opts: GetGtfsIdOpts) => string

/**
 * Gets a Digitransit compatible gtfsid for given parameters.
 */
export const getGtfsid: GetGtfsid = opts => {
  if (!(opts.commuterLineId || opts.trainNumber)) {
    throw new TypeError(
      'Can not determine gtfsid without commuterlineId or trainNumber'
    )
  }

  const source: 'digitraffic' | 'hsl' = opts.operatorShortCode === 'hsl' ? 'hsl' : 'digitraffic'
  const routeTypeId: 102 | 109 =
    opts.trainCategory === 'Long-distance' ? 102 : 109
  const commuterLineIdOrTrainNumber = opts.commuterLineId ?? opts.trainNumber

  // Railways to Russia are temporarily on hold, if this changes 20 could be an option as well.
  // https://en.wikipedia.org/wiki/List_of_UIC_country_codes
  const uicCode = opts.uicCode ?? 10

  return (
    `${source}:` +
    [
      opts.departureShortCode,
      opts.arrivalShortCode,
      commuterLineIdOrTrainNumber,
      routeTypeId,
      uicCode
    ].join('_')
  )
}
