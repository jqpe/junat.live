import {
  useCachedTrain,
  useSingleTrain,
  useSingleTrainSubscription
} from '~/lib/digitraffic'

export const useBestTrain = (departureDate?: string, trainNumber?: number) => {
  // Attempts to use a stale train from `useLiveTrains` cache to render the page
  // without waiting for a network request for users navigating from station page.
  const cachedTrain = useCachedTrain({
    departureDate,
    trainNumber: trainNumber as number
  })

  // A train fetched with GraphQL and the most reliable.
  const singleTrainQuery = useSingleTrain({
    trainNumber,
    departureDate
  })
  const initialTrain = singleTrainQuery.data || cachedTrain

  // A progressive enhancement over `singleTrainQuery`. Returns the original train and updates it with MQTT.
  // Changes to the original train are reflected on the returned `subscriptionTrain`.
  const [subscriptionTrain] = useSingleTrainSubscription({
    initialTrain,
    enabled: !!initialTrain
  })

  const train = subscriptionTrain || initialTrain || cachedTrain

  return { train, singleTrainQuery }
}
