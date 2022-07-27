import type { GetTrainsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '@junat/digitraffic/types'

import { fetchLiveTrains as digitrafficFetchLiveTrains } from '@junat/digitraffic'

import { simplifyTrains } from '@utils/simplify_train'

type FetchDigitrafficProps = {
  stationShortCode: string
  localizedStations: LocalizedStation[]
}

interface FetchDigitrafficWithOptions
  extends FetchDigitrafficProps,
    GetTrainsOptions {}

export async function fetchLiveTrains({
  stationShortCode,
  localizedStations,
  ...opts
}: FetchDigitrafficProps | FetchDigitrafficWithOptions) {
  const trains = await digitrafficFetchLiveTrains(stationShortCode, opts)

  if (!trains) {
    return []
  }

  return simplifyTrains(trains, stationShortCode, localizedStations)
}
