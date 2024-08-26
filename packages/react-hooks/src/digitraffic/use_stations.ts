import type { GetTranslatedStruct } from '@junat/core/i18n'
import type { LocalizedStation } from '@junat/core/types'
import type { GetStationsOptions } from '@junat/digitraffic'

import { useQuery } from '@tanstack/react-query'

import { INACTIVE_STATIONS } from '@junat/core/constants'
import { fetchStations } from '@junat/digitraffic'

interface UseStationsOpts extends GetStationsOptions {
  t: GetTranslatedStruct
}

export const useStations = (opts: UseStationsOpts) => {
  return useQuery<LocalizedStation[]>({
    queryKey: ['stations'],
    queryFn: () => {
      return fetchStations({
        inactiveStations: INACTIVE_STATIONS,
        betterNames: true,
        i18n: opts.t('stations'),
        proxy: true,
        keepNonPassenger: true,
        ...opts,
      })
    },
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity,
  })
}
