import { useQuery } from '@tanstack/react-query'

import { location } from '@junat/graphql/digitraffic/queries/location'
import { client } from '@junat/graphql/graphql-request'

/**
 * Fetch train locations for all running trains.
 */
export const useTrainLocations = () => {
  useTrainLocations.queryKey = ['locations']

  return useQuery({
    queryKey: useTrainLocations.queryKey,
    queryFn: async () => {
      const result = await client.request(location)
      return result.latestTrainLocations
    },
    // The query updates multiple times a second, always treat as stale to refetch on interval
    staleTime: Infinity,
    // 5 minutes, used to get new trains and remove old ones as MQTT does not do this by design
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

useTrainLocations.queryKey = [] as unknown[]
