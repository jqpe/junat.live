import type { StationMqttClient } from '@junat/digitraffic-mqtt'
import type { LiveTrainFragment } from '@junat/graphql/digitraffic'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { getNewTrains, trainsInFuture } from '@junat/core/utils/train'

interface UseLiveTrainsSubscriptionProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  queryKey: unknown[]
}

/**
 * Creates a subscription for `stationShortCode` and mutates the query cache with updated trains.
 * Only modifies existing trains in the cache, does not add new ones.
 * Connection is closed when the hook unmounts.
 */
export const useLiveTrainsSubscription = ({
  stationShortCode,
  type = 'DEPARTURE',
  queryKey,
}: UseLiveTrainsSubscriptionProps): void => {
  const [hasIterator, setHasIterator] = React.useState(false)
  const queryClient = useQueryClient()
  const client = useMqttClient(stationShortCode)

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
    if (!client || hasIterator) return

    const startIterator = async () => {
      for await (const updatedTrain of client.trains) {
        queryClient.setQueryData<LiveTrainFragment[]>(queryKey, trains =>
          getUpdatedData(trains, updatedTrain),
        )
      }
    }

    startIterator()
    setHasIterator(true)

    return function cleanup() {
      client.trains.return()
    }
  }, [client, getUpdatedData, hasIterator, queryClient, queryKey])
}

/**
 * @private
 *
 * Handles the creation of a Digitraffic MQTT client and the subscription to a specific station.
 * Connection is closed when the hook is unmounted or the station short code changes,
 * in which case the connection to the old station is closed and a new one is created.
 */
const useMqttClient = (stationShortCode: string) => {
  const [client, setClient] = React.useState<StationMqttClient>()
  const shortCode = React.useRef<string>(null!)

  React.useEffect(() => {
    const createClient = async () => {
      const { subscribeToStation } = await import('@junat/digitraffic-mqtt')

      setClient(await subscribeToStation(stationShortCode))
      shortCode.current = stationShortCode
    }

    if (shortCode.current !== stationShortCode) {
      Promise.resolve(client?.close).then(createClient)
    }

    return function cleanup() {
      client?.close()
    }
  }, [client, stationShortCode])

  return client
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
