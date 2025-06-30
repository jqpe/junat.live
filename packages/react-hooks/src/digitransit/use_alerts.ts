import type { AlertsQuery } from '@junat/graphql/digitransit'

import { useQuery } from '@tanstack/react-query'

import { alerts } from '@junat/graphql/digitransit/queries/alerts'
import { digitransitClient } from '@junat/graphql/graphql-request'

interface FetchAlertsOpts {
  apiKey: string
  station: string
  locale?: string
}

/**
 * Fetch alerts specific to a station.
 * Note that the station is determined using reverse search so using station shortcodes
 * will most likely not work.
 */
export const useAlerts = ({ station, apiKey, locale }: FetchAlertsOpts) => {
  return useQuery({
    queryKey: ['alerts', locale, station],
    queryFn: () => fetchAlerts({ station, apiKey, locale }),
    staleTime: 5 * 60 * 1000, // 5 minutes,
    refetchInterval: 2 * 60 * 1000, // 2 minutes,
    refetchOnWindowFocus: true,
  })
}

/** @private Fetch alerts specific to a station. */
export const fetchAlerts = async ({
  locale,
  station,
  apiKey,
}: FetchAlertsOpts) => {
  const result = await digitransitClient(apiKey).request(
    alerts,
    { station },
    locale ? { 'accept-language': locale } : {},
  )

  return findAlert(result.stations) || null
}

const findAlert = (stations: AlertsQuery['stations']) => {
  for (const station of stations ?? []) {
    if (station?.stops?.length === 0) continue

    for (const stop of station?.stops ?? []) {
      if (stop?.alerts?.length !== 0) {
        return stop?.alerts
      }
    }
  }
}
