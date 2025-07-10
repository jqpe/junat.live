import type { LocalizedStation } from '@junat/core/types'
import type { Train } from '@junat/digitraffic/types/train'
import type {
  LiveTrainFragment,
  TimeTableRowType,
} from '@junat/graphql/digitraffic'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  DEFAULT_TRAINS_COUNT,
  TRAINS_MULTIPLIER,
  TRAINS_OVERSHOOT,
} from '@junat/core/constants'
import { convertTrain } from '@junat/core/utils/train'
import { fetchWithError } from '@junat/digitraffic'
import { trains } from '@junat/graphql/digitraffic/queries/live_trains'
import { client } from '@junat/graphql/graphql-request'

export function useLiveTrains(opts: {
  count: number
  localizedStations: LocalizedStation[]
  stationShortCode: string
  filters?: { destination: string | null }
  type: TimeTableRowType
}) {
  useLiveTrains.queryKey = [
    'trains',
    opts.type,
    opts.stationShortCode,
    opts.count,
    opts.filters,
  ]

  const queryFn = async () => {
    if (!opts.filters?.destination) {
      return await fetchTrains(opts)
    }

    const params = {
      ...opts,
      filters: { destination: opts.filters.destination },
    }

    return await fetchFilteredTrains(params)
  }

  return useQuery<LiveTrainFragment[], unknown>({
    queryKey: useLiveTrains.queryKey,
    queryFn,
    enabled: opts.localizedStations.length > 0,
    refetchInterval: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

useLiveTrains.queryKey = [] as unknown[]

/**
 * @private
 */
export async function fetchTrains(opts: {
  stationShortCode: string
  count: number
  type: 'ARRIVAL' | 'DEPARTURE'
  localizedStations: LocalizedStation[]
}) {
  const trainType =
    opts.type === 'DEPARTURE' ? 'departingTrains' : 'arrivingTrains'
  const trainsCount =
    opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT

  const result = await client.request(trains, {
    station: opts.stationShortCode,
    [trainType]: trainsCount + TRAINS_OVERSHOOT,
  })

  if (!result.trainsByStationAndQuantity) {
    throw new TypeError('trains can not be undefined')
  }

  return result.trainsByStationAndQuantity.filter(train => train != null)
}

/**
 * @private
 */
export async function fetchFilteredTrains(opts: {
  stationShortCode: string
  filters: { destination: string }
  count: number
  type: 'ARRIVAL' | 'DEPARTURE'
}) {
  let from = opts.stationShortCode
  let to = opts.filters.destination

  if (opts.type === 'ARRIVAL') {
    ;[from, to] = [to, from]
  }

  const params = new URLSearchParams({
    limit: String(
      opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT,
    ),
  })
  const url = new URL(
    `https://rata.digitraffic.fi/api/v1/live-trains/station/${from}/${to}?${params}`,
  )

  const result = await fetchWithError(url)
  const json: Train[] | { code: string } = await result.json()

  if ('code' in json) {
    if (json.code === 'TRAIN_NOT_FOUND') {
      return []
    }

    throw new TypeError(JSON.stringify(json))
  }

  return json.map(train => convertTrain(train))
}
