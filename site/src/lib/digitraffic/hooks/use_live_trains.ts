import type { DigitrafficError } from '@junat/digitraffic'
import type { SimplifiedTrain } from '@typings/simplified_train'

import { useQuery } from '@tanstack/react-query'

import { simplifyTrains } from '@utils/train'
import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from 'src/constants'
import request from 'graphql-request'
import { normalizeTrains, trains } from '../queries/live_trains'
import { LocalizedStation } from '../types'

const DIGITRAFFIC = 'https://rata.digitraffic.fi/api/v2/graphql/graphql'

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
    const result = await request(DIGITRAFFIC, trains, {
      station: opts.stationShortCode,
      departingTrains:
        opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT,
      arrivedTrains: opts.arrived,
      arrivingTrains: opts.arriving,
      departedTrains: opts.departed
    })

    return simplifyTrains(
      normalizeTrains(result.trainsByStationAndQuantity),
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
