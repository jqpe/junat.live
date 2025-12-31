import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type {
  LiveTrainFragment,
  SingleTrainFragment,
} from '@junat/graphql/digitraffic'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { convertTrain } from '@junat/core/utils/train'

import { useSingleTrain } from './use_single_train'

type Props = {
  initialTrain: SingleTrainFragment | LiveTrainFragment | undefined
  enabled?: boolean
}

/**
 * Creates a subscription for a train and mutates the query cache with updated train.
 * Only modifies existing train in the cache, does not add a new one.
 * Subscription is closed when the hook unmounts.
 */
export const useSingleTrainSubscription = (props: Props): void => {
  const { initialTrain, enabled = true } = props
  const queryClient = useQueryClient()

  React.useEffect(() => {
    let client: TrainsMqttClient | undefined

    if (!enabled) return

    if (!(initialTrain?.departureDate && initialTrain.trainNumber)) {
      return
    }

    const createSubscription = async () => {
      const { subscribeToTrains } = await import('@junat/digitraffic-mqtt')
      client = await subscribeToTrains({
        trainNumber: initialTrain.trainNumber,
        departureDate: initialTrain.departureDate,
      })

      for await (const updatedTrain of client.trains) {
        queryClient.setQueriesData<SingleTrainFragment>(
          { queryKey: useSingleTrain.queryKey },
          train => mergeTrains(train, convertTrain(updatedTrain)),
        )
      }
    }

    createSubscription()

    return function cleanup() {
      client?.trains.return()
      client?.unsubscribe()
    }
  }, [
    enabled,
    initialTrain?.departureDate,
    initialTrain?.trainNumber,
    queryClient,
  ])
}

/**
 * Insert properties into `source`.
 *
 * @param source - of truth. Will be the object being merged into.
 * @param insert Additional properties to insert in source
 *
 * @returns a new train with the merged properties or the `source` if insert is a different train.
 */
export const mergeTrains = (
  source: Readonly<SingleTrainFragment> | undefined,
  insert: Readonly<SingleTrainFragment> | undefined,
) => {
  // Handle undefined
  if (source === undefined) {
    return
  }
  if (insert === undefined) {
    return source
  }

  // Handle state mismatch (comparing different trains)
  if (insert.departureDate !== source.departureDate) {
    return source
  }
  if (insert.trainNumber !== source.trainNumber) {
    return source
  }

  return Object.assign({ ...source }, insert)
}
