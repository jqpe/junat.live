import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '../types'

import { fetchWithError } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

import { simplifyTrains } from '@utils/train'
import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from 'src/constants'

import { client } from '../helpers/graphql_request'
import { normalizeTrains, trains } from '../queries/live_trains'

export function useLiveTrains(opts: {
  count: number
  localizedStations: LocalizedStation[]
  stationShortCode: string
  path: string
  filters?: { destination: string | null }
  onSuccess?: (data: SimplifiedTrain[]) => void
  arrived?: number
  arriving?: number
  departed?: number
}) {
  useLiveTrains.queryKey = [`trains/${opts.path}`, opts.count, opts.filters]

  const queryFn = async () => {
    if (opts.filters?.destination) {
      const from = opts.stationShortCode
      const to = opts.filters.destination

      const params = new URLSearchParams({
        limit: String(
          opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT
        )
      })
      const url = new URL(
        `https://rata.digitraffic.fi/api/v1/live-trains/station/${from}/${to}?${params}`
      )

      const result = await fetchWithError(url)
      const json = await result.json()

      if ('code' in json) {
        if (json.code === 'TRAIN_NOT_FOUND') {
          return []
        }

        throw new TypeError(json)
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
    queryKey: useLiveTrains.queryKey,
    queryFn,
    onSuccess: opts.onSuccess,
    enabled: opts.localizedStations.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true
  })
}

useLiveTrains.queryKey = [] as unknown[]
