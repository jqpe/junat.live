import type { GetTrainsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '@junat/digitraffic/types'

import { useQuery } from '@tanstack/react-query'
import { fetchLiveTrains } from '@junat/digitraffic'

import { simplifyTrains } from '@utils/simplify_train'

type FetchDigitrafficProps = {
  stationShortCode: string
  localizedStations: LocalizedStation[]
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
      departing: opts.count > 0 ? opts.count * 100 : 20
    })
  }

  return useQuery([`trains/${opts.path}`, opts.count], queryFn, {
    enabled: opts.localizedStations.length > 0,
    keepPreviousData: true
  })
}
