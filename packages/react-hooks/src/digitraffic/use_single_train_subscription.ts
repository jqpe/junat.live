import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type {
  LiveTrainFragment,
  SingleTrainFragment,
} from '@junat/graphql/digitraffic'

import React from 'react'

import { convertTrain } from '@junat/core/utils/train'

type Props = {
  initialTrain: SingleTrainFragment | LiveTrainFragment | undefined
  enabled?: boolean
}

export const useSingleTrainSubscription = (props: Props) => {
  const { initialTrain, enabled = true } = props

  const [train, setTrain] = React.useState<SingleTrainFragment | undefined>(
    initialTrain,
  )
  const [error, setError] = React.useState<unknown>()

  React.useEffect(() => {
    let client: TrainsMqttClient | undefined

    if (!enabled) return

    if (!(initialTrain?.departureDate && initialTrain.trainNumber)) {
      setError(
        new TypeError('initialTrain must be defined when enabled is true'),
      )
      return
    }

    const createSubscription = async () => {
      const { subscribeToTrains } = await import('@junat/digitraffic-mqtt')
      client = await subscribeToTrains({
        trainNumber: initialTrain.trainNumber,
        departureDate: initialTrain.departureDate,
      })

      for await (const updatedTrain of client.trains) {
        setTrain(convertTrain(updatedTrain))
      }
    }

    createSubscription()

    return function cleanup() {
      client?.unsubscribe()
    }
  }, [enabled, initialTrain])

  return [mergeTrains(initialTrain, train), error] as const
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
