import type { GetTrainsOptions } from '@junat/digitraffic'
import type { DigitrafficError } from '@junat/digitraffic/base/classes/digitraffic_error'
import type { SimplifiedTrain } from '@typings/simplified_train'

import { useQuery } from '@tanstack/react-query'
import { fetchLiveTrains } from '@junat/digitraffic'

import { simplifyTrains } from '@utils/simplify_train'
import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from 'src/constants'

type FetchDigitrafficProps = {
  stationShortCode: string
  localizedStations: Parameters<typeof simplifyTrains>[2]
}

interface FetchDigitrafficWithOptions
  extends FetchDigitrafficProps,
    GetTrainsOptions {}

const getLiveTrains = async ({
  stationShortCode,
  localizedStations,
  ...opts
}: FetchDigitrafficProps | FetchDigitrafficWithOptions) => {
  const trains = await fetchLiveTrains(stationShortCode, opts)

  if (!trains) {
    return []
  }

  return simplifyTrains(trains, stationShortCode, localizedStations)
}

interface UseLiveTrainsOpts
  extends FetchDigitrafficProps,
    FetchDigitrafficWithOptions {
  path: string
  count: number
  stationShortCode: string
}

export const useLiveTrains = (opts: UseLiveTrainsOpts) => {
  const queryFn = async () => {
    return getLiveTrains({
      stationShortCode: opts.stationShortCode,
      localizedStations: opts.localizedStations,
      departing:
        opts.count > 0 ? opts.count * TRAINS_MULTIPLIER : DEFAULT_TRAINS_COUNT
    })
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
