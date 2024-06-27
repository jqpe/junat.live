import type { Train } from '@junat/digitraffic/types'

import { useQueryClient } from '@tanstack/react-query'

import { getCalendarDate } from '~/utils/date'
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
export const useCachedTrain = (id: Identifier) => {
  const queryClient = useQueryClient()
  // queryKey is the latest call of `useLiveTrains`, so the most recent data for a station.
  const data = queryClient.getQueryData<Train[]>(useLiveTrains.queryKey)

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
