import type { LocalizedStation } from '@lib/digitraffic'

import { fetchStations } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

import translate from '@utils/translate'

import { INACTIVE_STATIONS } from 'src/constants'

const getStations = async () => {
  return fetchStations({
    inactiveStations: INACTIVE_STATIONS,
    betterNames: true,
    i18n: translate('all')('stations'),
    proxy: true
  })
}

export const useStations = () => {
  return useQuery<LocalizedStation[]>(['stations '], getStations, {
    cacheTime: Infinity
  })
}
