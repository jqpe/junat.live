import type { GetTrainsOptions, LocalizedStation } from '@junat/digitraffic'

import { getLiveTrains, getStations } from '@junat/digitraffic'

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
  const trains = await getLiveTrains(stationShortCode, { ...opts })

  if (!trains) {
    return []
  }

  return simplifyTrains(trains, stationShortCode, localizedStations)
}

export async function fetchStations() {
  return await getStations<LocalizedStation[]>({
    omitInactive: false,
    locale: ['fi', 'en', 'sv']
  })
}
