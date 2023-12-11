import { useQuery } from '@tanstack/react-query'
import { client } from '../helpers/graphql_request'
import { route } from '../queries'

type UseRouteOpts = {
  id: string | null
}

export const useRoute = (opts: UseRouteOpts) => {
  return useQuery({
    queryKey: ['digitransit-route', opts.id],
    queryFn: async () => {
      const result = await client.request(route, {
        id: opts.id
      })

      return result.routes
    },
    enabled: opts.id !== null
  })
}
