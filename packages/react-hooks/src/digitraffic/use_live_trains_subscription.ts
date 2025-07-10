import type { StationMqttClient } from '@junat/digitraffic-mqtt'
import type { LiveTrainFragment } from '@junat/graphql/digitraffic'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
  convertTrain,
  getNewTrains,
  trainsInFuture,
} from '@junat/core/utils/train'
import { TimeTableRowType } from '@junat/graphql/digitraffic'

/**
 * Creates a subscription for `stationShortCode` and mutates the query cache with updated trains.
 * Only modifies existing trains in the cache, does not add new ones.
 * Subscription is closed when the hook unmounts.
 */
export const useLiveTrainsSubscription = (
  stationShortCode: string,
  type = TimeTableRowType.Departure,
): void => {
  const queryClient = useQueryClient()

  const getUpdatedData = React.useCallback(
    (
      trains: LiveTrainFragment[] | undefined,
      updatedTrain: LiveTrainFragment,
    ) => {
      return updateMatchingTrains(trains, updatedTrain, stationShortCode, type)
    },
    [stationShortCode, type],
  )

  React.useEffect(() => {
    let client: StationMqttClient | undefined

    const createSubscription = async () => {
      const { subscribeToStation } = await import('@junat/digitraffic-mqtt')
      client = await subscribeToStation(stationShortCode)

      for await (const updatedTrain of client.trains) {
        queryClient.setQueriesData<LiveTrainFragment[]>(
          { queryKey: ['trains', type, stationShortCode] },
          trains => getUpdatedData(trains, convertTrain(updatedTrain)),
        )
      }
    }

    createSubscription()

    return function cleanup() {
      client?.unsubscribe()
    }
  }, [getUpdatedData, queryClient, stationShortCode, type])
}

/**
 * @private
 */
export const updateMatchingTrains = (
  trains: LiveTrainFragment[] | undefined,
  updatedTrain: LiveTrainFragment,
  stationShortCode: string,
  type: 'DEPARTURE' | 'ARRIVAL',
): LiveTrainFragment[] => {
  if (!trains) {
    return []
  }

  const matchingTrain = trains.find(
    train => train.trainNumber === updatedTrain.trainNumber,
  )

  if (matchingTrain === undefined) {
    return trains
  }

  const newTrains = getNewTrains(trains, updatedTrain, stationShortCode, type)

  return trainsInFuture(newTrains, stationShortCode, type)
}
