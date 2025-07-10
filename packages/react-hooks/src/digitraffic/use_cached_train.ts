import type { LiveTrainFragment } from '@junat/graphql/digitraffic'

import { useQueryClient } from '@tanstack/react-query'

import { getCalendarDate } from '@junat/core/utils/date'

import { useLiveTrains } from './use_live_trains'

type Identifier = {
  trainNumber: number
  /**
   * @default latest
   */
  departureDate?: string
}

/**
 * Attempts to find a train from `useLiveTrains` cache with given `id`.
 */
export const useCachedTrain = (
  id: Identifier,
): LiveTrainFragment | undefined => {
  const queryClient = useQueryClient()
  // queryKey is the latest call of `useLiveTrains`, so the most recent data for a station.
  const data = queryClient.getQueryData<LiveTrainFragment[]>(
    useLiveTrains.queryKey,
  )

  const departureDate =
    id.departureDate === 'latest'
      ? getCalendarDate(new Date().toISOString())
      : id.departureDate

  return data?.find(
    train =>
      train.trainNumber === id.trainNumber &&
      train.departureDate === departureDate,
  )
}
