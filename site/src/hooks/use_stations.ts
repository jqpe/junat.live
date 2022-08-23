import type { LocalizedStation } from '@lib/digitraffic'

import { fetchStations } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

import translate from '@utils/translation'

const getStations = async () => {
  return fetchStations({
    keepInactive: true,
    betterNames: true,
    i18n: translate('all')('stations'),
    proxy: true
  })
}

export const useStations = () => {
  return useQuery<LocalizedStation[]>(['stations'], getStations)
}
