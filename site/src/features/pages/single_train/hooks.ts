import type { Train } from '@junat/graphql/digitraffic'
import type { NormalizedTrain } from '@junat/graphql/digitraffic/queries/single_train'

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
  const initialTrain = (singleTrainQuery.data ||
    cachedTrain) as unknown as NormalizedTrain & Train

  // A progressive enhancement over `singleTrainQuery`. Returns the original train and updates it with MQTT.
  // Changes to the original train are reflected on the returned `subscriptionTrain`.
  const [subscriptionTrain] = useSingleTrainSubscription({
    initialTrain,
    enabled: !!initialTrain,
  })

  const train = subscriptionTrain || initialTrain || cachedTrain

  return { train, singleTrainQuery }
}
