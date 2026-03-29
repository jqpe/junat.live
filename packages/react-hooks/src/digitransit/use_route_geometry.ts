import { useQuery } from '@tanstack/react-query'

import { getRouteGtfsId } from '@junat/core/utils/train'
import { routeGeometry } from '@junat/graphql/digitransit/queries/route_geometry'
import { digitransitClient } from '@junat/graphql/graphql-request'

interface UseRouteGeometryOpts {
  apiKey: string
  departure?: string
  destination?: string
  trainNumber?: number
  commuterLineId?: string | null
  trainType?: string
  operatorUicCode?: string
  enabled?: boolean
}

/**
 * Fetch route geometries for a train.
 * Returns null if journey sections are not available (no departure/destination info).
 */
export const useRouteGeometry = ({
  apiKey,
  departure,
  destination,
  trainNumber,
  commuterLineId,
  trainType,
  operatorUicCode,
  enabled = true,
}: UseRouteGeometryOpts) => {
  const canFetch =
    enabled &&
    departure &&
    destination &&
    trainNumber &&
    trainType &&
    operatorUicCode

  const gtfsId = canFetch
    ? getRouteGtfsId({
        departure,
        destination,
        trainNumber,
        commuterLineId: commuterLineId ?? null,
        trainType,
        operatorUicCode,
      })
    : null

  return useQuery({
    queryKey: ['routeGeometry', gtfsId],
    queryFn: async () => {
      if (!gtfsId) return null

      const result = await digitransitClient(apiKey).request(routeGeometry, {
        id: gtfsId,
      })

      return result.route?.patterns?.map(p => p?.patternGeometry?.points)
    },
    enabled: !!canFetch,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}
