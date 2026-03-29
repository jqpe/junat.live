/* eslint-disable sonarjs/no-nested-functions */
import type { TrainLocationsMqttClient } from '@junat/digitraffic-mqtt'
import type { LocationQuery } from '@junat/graphql/digitraffic'

import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { useTrainLocations } from './use_train_locations'

type Props = {
  departureDate?: string
  trainNumber?: number
}

/** Creates a subscription for train locations and updates query cache with updated locations */
export const useTrainLocationsSubscription = (props: Props): void => {
  const { departureDate, trainNumber } = props
  const queryClient = useQueryClient()

  React.useEffect(() => {
    let client: TrainLocationsMqttClient | undefined

    const createSubscription = async () => {
      const { subscribeToTrainLocations } =
        await import('@junat/digitraffic-mqtt')
      client = await subscribeToTrainLocations()

      for await (const updated of client.locations) {
        queryClient.setQueriesData<LocationQuery['latestTrainLocations']>(
          { queryKey: useTrainLocations.queryKey },
          original => {
            if (!original) return original

            const idx = original.findIndex(
              t => t.train?.trainNumber === Number(updated.trainNumber),
            )

            if (idx === -1) return original

            const existingTrain = original[idx]
            if (!existingTrain) return original

            // Create updated array with the new location data
            const updatedArray = [...original]
            updatedArray[idx] = {
              ...existingTrain,
              speed: updated.speed,
              accuracy: updated.accuracy ?? null,
              timestamp: updated.timestamp,
              location: updated.location.coordinates,
              train: existingTrain.train ?? null,
            }

            return updatedArray
          },
        )
      }
    }

    createSubscription()

    return function cleanup() {
      client?.locations.return()
      client?.unsubscribe()
    }
  }, [departureDate, trainNumber, queryClient])
}
