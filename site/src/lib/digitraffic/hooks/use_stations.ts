import type { GetStationsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '~/lib/digitraffic'

import { fetchStations } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

import { translate } from '@junat/locales'

import { INACTIVE_STATIONS } from 'src/constants'

export const useStations = (opts?: GetStationsOptions) => {
  return useQuery<LocalizedStation[]>({
    queryKey: ['stations'],
    queryFn: () => {
      return fetchStations({
        inactiveStations: INACTIVE_STATIONS,
        betterNames: true,
        i18n: translate('all')('stations'),
        proxy: true,
        keepNonPassenger: true,
        ...opts
      })
    },
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity
  })
}
