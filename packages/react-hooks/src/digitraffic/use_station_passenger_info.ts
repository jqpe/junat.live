import type { StationPassengerInfoQuery } from '@junat/graphql'

import { useQuery } from '@tanstack/react-query'

import { stationPassengerInfo } from '@junat/graphql/queries/passenger_info'
import { client } from '@junat/graphql/graphql-request'

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
export const fetchStationPassengerInfo = async (
  stationShortCode: string,
): Promise<
  StationPassengerInfoQuery['passengerInformationMessagesByStation']
> => {
  const result = await client.request(stationPassengerInfo, {
    stationShortCode,
  })

  return result.passengerInformationMessagesByStation
}
