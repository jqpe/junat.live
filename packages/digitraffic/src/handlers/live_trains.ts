import type { Train } from '../types/train'
import type { TrainCategory } from '../types/train_category'

export interface GetTrainsOptions {
  /**
   * @default 0
   */
  arrivedTrains?: number
  /**
   * @default 0
   */
  arrivingTrains?: number
  /**
   * @default 0
   */
  departedTrains?: number
  /**
   * @default 20
   */
  departingTrains?: number
  /**
   * @default false
   */
  includeNonStopping?: boolean
  /**
   * @default ['Commuter', 'Long-Distance']
   */
  trainCategories?: TrainCategory[]
  /**
   * Used to query only updated trains that have changed since version.
   *
   * When you initially request, you'll get a list of trains which all have a version field.
   * You can use the largest version to query only updated trains.
   *
   * @default Omitted, meaning that the latest trains are returned.
   */
  version?: number
}

export const getLiveTrains = async (
  /**
   * E.g. HKI for Helsinki,
   * @see https://rata.digitraffic.fi/api/v1/metadata/stations
   */
  stationShortCode: string,
  {
    arrivedTrains,
    arrivingTrains,
    departedTrains,
    departingTrains,
    includeNonStopping,
    trainCategories,
    version
  }: GetTrainsOptions = {}
): Promise<Train[]> => {
  if (typeof stationShortCode !== 'string') {
    throw new TypeError(
      `Expected stationShortCode to be a string, received ${stationShortCode}`
    )
  }

  const parameters = new URLSearchParams({
    arrived_trains: `${arrivedTrains ?? 0}`,
    arriving_trains: `${arrivingTrains ?? 0}`,
    departed_trains: `${departedTrains ?? 0}`,
    departing_trains: `${departingTrains ?? 20}`,
    train_categories: `${
      trainCategories?.join(',') || 'Commuter,Long-Distance'
    }`
  })

  if (version) {
    parameters.append('version', `${version}`)
  }
  if (includeNonStopping === true) {
    parameters.append('include_nonstopping', 'true')
  }

  const path = `live-trains/station/${stationShortCode}`

  const response = await fetch(
    `https://rata.digitraffic.fi/api/v1/${path}?${parameters}`
  )
  if (!response.ok) {
    throw new Error(
      `Request to ${path} failed with status code ${
        response.status
      }: ${await response.text()}`
    )
  }

  return await response.json()
}
