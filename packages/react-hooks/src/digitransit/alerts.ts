import type { AlertsQuery } from '@junat/graphql/digitransit'

import { useQuery } from '@tanstack/react-query'

import { alerts } from '@junat/graphql/digitransit/queries/alerts'
import { digitransitClient } from '@junat/graphql/graphql-request'

interface FetchAlertsOpts {
  apiKey: string
  station: string
}

/**
 * Fetch single train data. The request will not be sent unless the trainNumber and departureDate are defined.
 */
export const useAlerts = ({ station, apiKey }: FetchAlertsOpts) => {
  return useQuery({
    queryKey: ['alerts', station],
    queryFn: () => fetchAlerts({ station, apiKey }),
    staleTime: 5 * 60 * 1000, // 5 minutes,
    refetchInterval: 2 * 60 * 1000, // 2 minutes,
    refetchOnWindowFocus: true,
  })
}

/**
 * @private Fetches a single train for `departureDate` and `trainNumber`.
 *
 * @throws if either of the arguments is undefined.
 */
export const fetchAlerts = async ({
  station,
  apiKey,
}: {
  station: string
  apiKey: string
}) => {
  const result = await digitransitClient(apiKey).request(alerts, { station })

  const stations = findAlert(result.stations)

  if (!stations || alert === null) {
    return null
  }

  return stations
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
