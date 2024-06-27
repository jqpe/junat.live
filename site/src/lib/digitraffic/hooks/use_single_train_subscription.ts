import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type { Train } from '~/lib/digitraffic/queries/single_train'

import React from 'react'

type Props = {
  initialTrain: Train | undefined
  enabled?: boolean
}

export const useSingleTrainSubscription = (props: Props) => {
  const { initialTrain, enabled = true } = props

  const [train, setTrain] = React.useState<Train | undefined>(initialTrain)
  const [client, setClient] = React.useState<TrainsMqttClient>()
  const [error, setError] = React.useState<unknown>()

  React.useEffect(() => {
    if (!enabled) return

    if (!(initialTrain?.departureDate && initialTrain.trainNumber)) {
      setError(
        new TypeError('initialTrain must be defined when enabled is true'),
      )
      return
    }

    const createSubscription = async () => {
      const { subscribeToTrains } = await import('@junat/digitraffic-mqtt')
      const client = await subscribeToTrains({
        trainNumber: initialTrain.trainNumber,
        departureDate: initialTrain.departureDate,
      })

      setClient(client)

      for await (const updatedTrain of client.trains) {
        setTrain(updatedTrain)
      }
    }

    const { mqttClient } = client ?? {}

    if (!client || mqttClient?.disconnecting || mqttClient?.disconnected) {
      createSubscription()
    }

    return function cleanup() {
      client?.close()
      client?.trains.return()
    }
  }, [client, enabled, initialTrain])

  return [mergeTrains(initialTrain, train), error, client] as const
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
  source: Readonly<Train> | undefined,
  insert: Readonly<Train> | undefined,
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
