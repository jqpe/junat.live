import { useQuery } from '@tanstack/react-query'

import { location } from '@junat/graphql/digitraffic/queries/location'
import { client } from '@junat/graphql/graphql-request'

/**
 * Fetch single train data. The request will not be sent unless the trainNumber and departureDate are defined.
 */
export const useTrainLocations = () => {
  useTrainLocations.queryKey = ['locations']

  return useQuery({
    queryKey: useTrainLocations.queryKey,
    queryFn: async () => {
      const result = await client.request(location)
      return result.latestTrainLocations
    },
    staleTime: 0,
    // Subscription only modifies existing trains, polling is used to remove / add trains
    refetchInterval: () => 10 * 1000, // 10 secs,
    refetchOnWindowFocus: false,
  })
}

useTrainLocations.queryKey = [] as unknown[]
