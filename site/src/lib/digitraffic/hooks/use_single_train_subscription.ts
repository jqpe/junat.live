import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type { Train } from '~/lib/digitraffic/queries/single_train'

import React from 'react'

type Props = {
  initialTrain: Train | undefined
  enabled?: boolean
}

export const useSingleTrainSubscription = (
  props: Props
): [Train | undefined, unknown, TrainsMqttClient | undefined] => {
  const { initialTrain, enabled = true } = props

  const [train, setTrain] = React.useState<Train | undefined>(initialTrain)
  const [client, setClient] = React.useState<TrainsMqttClient>()
  const [error, setError] = React.useState<unknown>()

  React.useEffect(() => {
    if (!enabled) return

    if (!(initialTrain?.departureDate && initialTrain.trainNumber)) {
      setError(
        new TypeError('initialTrain must be defined when enabled is true')
      )
      return
    }

    const createSubscription = async () => {
      const { subscribeToTrains } = await import('@junat/digitraffic-mqtt')
      const client = await subscribeToTrains(initialTrain)

      setClient(client)

      for await (const updatedTrain of client.trains) {
        setTrain(updatedTrain)
      }
    }

    if (!client) createSubscription()

    return function cleanup() {
      client?.close()
      client?.trains.return()
    }
  }, [client, enabled, initialTrain])

  return [train, error, client]
}
