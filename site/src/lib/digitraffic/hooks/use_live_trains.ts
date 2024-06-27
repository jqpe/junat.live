import type { Train } from '@junat/digitraffic/types'
import type { LocalizedStation } from '../types'

import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from '@junat/core/constants'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchWithError } from '@junat/digitraffic'

import { client } from '../helpers/graphql_request'
import { normalizeTrains, trains } from '../queries/live_trains'

export function useLiveTrains(opts: {
  count: number
  localizedStations: LocalizedStation[]
  stationShortCode: string
  filters?: { destination: string | null }
  type: 'ARRIVAL' | 'DEPARTURE'
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

  return useQuery<Train[], unknown>({
    queryKey: useLiveTrains.queryKey,
    queryFn,
    enabled: opts.localizedStations.length > 0,
    staleTime: 30 * 1000, // 30 seconds
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

  const result = await client.request(trains, {
    station: opts.stationShortCode,
    [trainType]:
      opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT,
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

  return normalizeTrains(t)
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
  const json = await result.json()

  if ('code' in json) {
    if (json.code === 'TRAIN_NOT_FOUND') {
      return []
    }

    throw new TypeError(json)
  }

  return json
}
