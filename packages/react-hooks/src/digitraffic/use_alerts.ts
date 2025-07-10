import { useQuery } from '@tanstack/react-query'

import { fetchPassengerInformationMessages } from '@junat/digitraffic'

interface UsePassengerInformationOptions {
  stationShortCode: string
  enabled?: boolean
}

export const useAlerts = ({
  stationShortCode,
  enabled = true,
}: UsePassengerInformationOptions) => {
  return useQuery({
    queryKey: ['passenger-information', stationShortCode],
    queryFn: ({ signal }) => {
      return fetchPassengerInformationMessages({
        stationShortCode,
        signal,
      })
    },
    enabled,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}
