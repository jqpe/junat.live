import { useQuery } from '@tanstack/react-query'

import { route } from '@junat/graphql/digitransit/queries/route'
import { digitransitClient } from '@junat/graphql/graphql-request'

type UseRouteOpts = {
  apiKey: string
  // `null` disables the hook
  id: string | null
}

export const useRoute = (opts: UseRouteOpts) => {
  const client = digitransitClient(opts.apiKey)

  return useQuery({
    queryKey: ['digitransit-route', opts.id],
    queryFn: async () => {
      if (opts.id === null) {
        throw new TypeError(
          'id should be known at this point. `enabled` precondition failed',
        )
      }

      const result = await client.request(route, {
        id: opts.id,
      })

      return result.routes
    },
    enabled: opts.id !== null,
  })
}
