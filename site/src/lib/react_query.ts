import { DigitrafficError } from '@junat/digitraffic'
import { QueryClient } from '@tanstack/react-query'

/**
 * Get the first erroneus query from a list of queries, in ascending order, if any.
 */
export const getErrorQuery = <T extends { isError: boolean }>(queries: T[]) => {
  return queries.find(query => query.isError)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof DigitrafficError && !error.isNetworkError) {
          return false
        }

        return failureCount !== 2
      }
    }
  }
})
