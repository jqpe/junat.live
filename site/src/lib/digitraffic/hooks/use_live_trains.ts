import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '../types'

import { useQuery } from '@tanstack/react-query'

import { simplifyTrains } from '@utils/train'
import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from 'src/constants'

import { normalizeTrains, trains } from '../queries/live_trains'
import { client } from '../helpers/graphql_request'

export const useLiveTrains = (opts: {
  count: number
  localizedStations: LocalizedStation[]
  stationShortCode: string
  path: string
  filters?: { destination: string | null }
  arrived?: number
  arriving?: number
  departed?: number
}) => {
  const queryFn = async () => {
    if (opts.filters?.destination) {
      const result = await fetch(
        `https://rata.digitraffic.fi/api/v1/live-trains/station/${
          opts.stationShortCode
        }/${opts.filters.destination}?limit=${
          opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT
        }`
      )
      const json = await result.json()

      if ('errorMessage' in json) {
        console.error(json)
        return []
      }

      return simplifyTrains(json, opts.stationShortCode, opts.localizedStations)
    }

    const result = await client.request(trains, {
      station: opts.stationShortCode,
      departingTrains:
        opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT,
      arrivedTrains: opts.arrived,
      arrivingTrains: opts.arriving,
      departedTrains: opts.departed
    })

    if (!result.trainsByStationAndQuantity) {
      throw new TypeError('trains can not be undefined')
    }

    type NonNullTrains = NonNullable<
      (typeof result.trainsByStationAndQuantity)[number]
    >[]

    const t = <NonNullTrains>(
      result.trainsByStationAndQuantity.filter(train => train !== null)
    )

    return simplifyTrains(
      normalizeTrains(t),
      opts.stationShortCode,
      opts.localizedStations
    ).filter(train => train.commercialStop)
  }

  return useQuery<SimplifiedTrain[], unknown>({
    queryKey: [`trains/${opts.path}`, opts.count, opts.filters],
    queryFn,
    enabled: opts.localizedStations.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true
  })
}
