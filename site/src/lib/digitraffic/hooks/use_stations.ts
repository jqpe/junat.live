import type { LocalizedStation } from '@lib/digitraffic'
import type { GetStationsOptions } from '@junat/digitraffic'

import { fetchStations } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

import translate from '@utils/translate'

import { INACTIVE_STATIONS } from 'src/constants'

const getStations = async (opts?: GetStationsOptions) => {
  return fetchStations({
    inactiveStations: INACTIVE_STATIONS,
    betterNames: true,
    i18n: translate('all')('stations'),
    proxy: true,
    keepNonPassenger: true,
    ...opts
  })
}

export const useStations = (opts?: GetStationsOptions) => {
  return useQuery<LocalizedStation[]>(['stations '], () => getStations(opts), {
    cacheTime: Infinity
  })
}
