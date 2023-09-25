import type { DigitrafficError } from '@junat/digitraffic'
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
  arrived?: number
  arriving?: number
  departed?: number
}) => {
  const queryFn = async () => {
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
    )
  }

  return useQuery<SimplifiedTrain[], DigitrafficError>(
    [`trains/${opts.path}`, opts.count],
    queryFn,
    {
      enabled: opts.localizedStations.length > 0,
      keepPreviousData: true
    }
  )
}
