import { useQuery } from '@tanstack/react-query'

import { stationPassengerInfo } from '@junat/graphql/digitraffic/queries/passenger_info'
// TODO: remove beta client when production api reaches feature parity
import { betaClient } from '@junat/graphql/graphql-request'

/**
 * Fetch generic station passenger information, see
 * https://www.digitraffic.fi/rautatieliikenne#matkustajainformaation-tiedotteet-passenger-information
 */
export const useStationPassengerInfo = (opts: { stationShortCode: string }) => {
  const { stationShortCode } = opts

  return useQuery({
    queryKey: ['passenger-info', stationShortCode],
    queryFn: () => fetchStationPassengerInfo(stationShortCode),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // a minute
    refetchOnWindowFocus: true,
  })
}

/** Fetches passenger information exceptions specific to a station */
export const fetchStationPassengerInfo = async (stationShortCode: string) => {
  const result = await betaClient.request(stationPassengerInfo, {
    stationShortCode,
  })

  return result.passengerInformationMessagesByStation
}
