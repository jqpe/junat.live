import { useQuery } from '@tanstack/react-query'

import {
  fetchTrafficInfoMessages,
  fetchTriggerPoints,
  realizations,
} from '@junat/digitraffic'

interface UseTrafficInfoOpts {
  trainNumber?: number
  departureDate?: string
}

export const useRealizations = (opts: UseTrafficInfoOpts) => {
  return useQuery({
    placeholderData: [],
    queryKey: [
      'realizations',
      opts.departureDate || 'latest',
      opts.trainNumber,
    ],
    enabled: !!opts.trainNumber,
    refetchInterval: 10_000,
    queryFn: async ({ signal }) => {
      if (!opts.trainNumber) throw new TypeError('unreachable')

      const triggers = await fetchTriggerPoints({ signal })
      const messages = await fetchTrafficInfoMessages({
        trainNumber: opts.trainNumber,
        signal,
      })

      return realizations(triggers, messages)
    },
  })
}
