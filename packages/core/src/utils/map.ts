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
