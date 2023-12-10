import type { Train } from '~/lib/digitraffic/queries/single_train'

import { useQuery } from '@tanstack/react-query'

import React from 'react'
import { TrainsMqttClient } from '@junat/digitraffic-mqtt'

type TrainExpectedProps = { departureDate: string, trainNumber: number }

type Return<T extends TrainExpectedProps> = Partial<[T, unknown]>

interface UseSingleTrainSubscription {
  /**
   * Takes an existing train and then subscribes to a MQTT topic for that train.
   * Any updates to that topic yields a new train.
   *
   * @throws {TypeError} If `initialTrain` is undefined and `enabled` is true.
   */
  <T extends TrainExpectedProps>(options: {
    /**
     * Train to update.
     */
    initialTrain: T | undefined
    /**
     * Whether to subscribe; used to defer subscribing if `initialTrain` is not defined at the time of calling.
     *
     * @default true
     */
    enabled?: boolean
  }): Return<T>

  <T extends TrainExpectedProps>(options: { initialTrain: Train }): Return<T>
}

const TRAINS_CLIENT_QUERY_KEY = 'live-train-mqtt' as const

export const useSingleTrainSubscription: UseSingleTrainSubscription = <T extends TrainExpectedProps>({
  initialTrain,
  ...rest
}: {initialTrain: T, enabled?: boolean}) => {
  const [train, setTrain] = React.useState<T | undefined>(initialTrain)
  const [error, setError] = React.useState<unknown>()

  const enabled = 'enabled' in rest ? rest.enabled : true

  const clientQuery = useClientQuery<T>(initialTrain, setError, enabled)

  React.useMemo(() => {
    if (clientQuery.error) {
      setError(clientQuery.error)
    }

    if (clientQuery.isFetching || !clientQuery.data) return

    if (!train || train.departureDate !== initialTrain?.departureDate) {
      setTrain(initialTrain)
    }

    const client = clientQuery.data

    ;(async () => {
      for await (const updatedTrain of client.trains) {
        setTrain(updatedTrain as unknown as T)
      }
    })()
  }, [
    clientQuery.error,
    clientQuery.isFetching,
    clientQuery.data,
    train,
    initialTrain
  ])

  React.useEffect(() => {
    if (clientQuery.data) {
      return function cleanup() {
        clientQuery.data?.close()
        clientQuery.data?.trains.return()
      }
    }
  }, [clientQuery])

  return [train, error]
}
function useClientQuery<T extends TrainExpectedProps>(
  initialTrain: T | undefined,
  setError: React.Dispatch<unknown>,
  enabled: boolean | undefined
) {
  return useQuery<TrainsMqttClient | undefined>(
    [
      TRAINS_CLIENT_QUERY_KEY,
      initialTrain?.departureDate,
      initialTrain?.trainNumber
    ],
    async () => {
      if (!initialTrain) {
        const invalidParameters = new TypeError(
          `initalTrain must be defined if 'enabled' is set to true. Received ${initialTrain}`
        )

        setError(invalidParameters)

        throw invalidParameters
      }

      const { subscribeToTrains } = await import('@junat/digitraffic-mqtt')

      const { departureDate, trainNumber } = initialTrain

      return subscribeToTrains({ departureDate, trainNumber })
    },
    { enabled, cacheTime: 0, staleTime: Infinity }
  )
}
