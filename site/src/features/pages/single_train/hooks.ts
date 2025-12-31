import { useCachedTrain } from '@junat/react-hooks/digitraffic/use_cached_train'
import { useSingleTrain } from '@junat/react-hooks/digitraffic/use_single_train'
import { useSingleTrainSubscription } from '@junat/react-hooks/digitraffic/use_single_train_subscription'

export const useBestTrain = (departureDate?: string, trainNumber?: number) => {
  // Attempts to use a stale train from `useLiveTrains` cache to render the page
  // without waiting for a network request for users navigating from station page.
  const cachedTrain = useCachedTrain({
    departureDate,
    trainNumber: trainNumber as number,
  })

  // A train fetched with GraphQL and the most reliable.
  const singleTrainQuery = useSingleTrain({
    trainNumber,
    departureDate,
  })

  const train = singleTrainQuery.data || cachedTrain

  // A progressive enhancement over `singleTrainQuery`. Writes to useSingleTrain cache.
  useSingleTrainSubscription({
    initialTrain: train,
    enabled: !!train,
  })

  return { train, singleTrainQuery }
}
