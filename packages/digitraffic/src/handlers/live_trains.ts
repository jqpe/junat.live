import type { Train } from '../types/train'
import type { TrainCategory } from '../types/train_category'

import { createHandler, HandlerOptions } from '../base/create_handler'
import { createFetch } from '../base/create_fetch'

export interface GetTrainsOptions extends HandlerOptions {
  /**
   * @default 0
   */
  arrived?: number
  /**
   * @default 0
   */
  arriving?: number
  /**
   * @default 0
   */
  departed?: number
  /**
   * @default 20
   */
  departing?: number
  /**
   * @default false
   */
  includeNonStopping?: boolean
  /**
   * @default ['Commuter', 'Long-Distance']
   */
  categories?: TrainCategory[]
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

const liveTrains = async (
  /**
   * E.g. HKI for Helsinki,
   * @see https://rata.digitraffic.fi/api/v1/metadata/stations
   */
  stationShortCode: string,
  opts: GetTrainsOptions = {}
): Promise<Train[] | undefined> => {
  if (typeof stationShortCode !== 'string') {
    throw new TypeError(
      `Expected stationShortCode to be a string, received ${stationShortCode}`
    )
  }

  // Override default if the sum of other parameters is greater than zero.
  const hasArgs =
    [opts.arrived, opts.arriving, opts.departed].reduce<number>(
      (acc, curr) => acc + (curr ?? 0),
      0
    ) > 0

  const parameters = new URLSearchParams({
    arrived_trains: `${opts.arrived ?? 0}`,
    arriving_trains: `${opts.arriving ?? 0}`,
    departed_trains: `${opts.departed ?? 0}`,
    departing_trains: `${opts.departing ?? hasArgs ? 0 : 20}`,
    train_categories: `${
      opts.categories?.join(',') || 'Commuter,Long-Distance'
    }`
  })

  if (opts.version) {
    parameters.append('version', `${opts.version}`)
  }
  if (opts.includeNonStopping === true) {
    parameters.append('include_nonstopping', 'true')
  }

  const path = `/live-trains/station/${stationShortCode}`

  return await createFetch(path, { query: parameters, signal: opts.signal })
}

export const getLiveTrains = createHandler(liveTrains)
