import type { GetStationsOptions } from '@junat/digitraffic'
import type { LocalizedStation } from '~/lib/digitraffic'

import { useQuery } from '@tanstack/react-query'
import { INACTIVE_STATIONS } from 'src/constants'

import { fetchStations } from '@junat/digitraffic'

import { translate } from '~/utils/translate'

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
        ...opts,
      })
    },
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity,
  })
}
