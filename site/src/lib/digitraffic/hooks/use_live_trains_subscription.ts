import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '@lib/digitraffic'

import React from 'react'

import { getNewTrains, trainsInFuture } from '@utils/train'
import { useQuery } from '@tanstack/react-query'

interface UseLiveTrainsSubscriptionProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  stations: LocalizedStation[]
  trains: SimplifiedTrain[]
  setTrains: React.Dispatch<React.SetStateAction<SimplifiedTrain[]>>
}

const LIVE_TRAINS_CLIENT_QUERY_KEY = 'live-trains-mqtt'

export const useLiveTrainsSubscription = ({
  stationShortCode,
  stations,
  setTrains,
  type = 'DEPARTURE'
}: UseLiveTrainsSubscriptionProps): void => {
  const { data: client } = useQuery(
    [LIVE_TRAINS_CLIENT_QUERY_KEY, stationShortCode],
    async () => {
      const { subscribeToStation } = await import('@junat/digitraffic-mqtt')

      return await subscribeToStation(stationShortCode)
    }
  )

  React.useEffect(() => {
    if (!client) {
      return
    }

    ;(async () => {
      for await (const updatedTrain of client.trains) {
        setTrains(trains => {
          const matchingTrain = trains.find(
            train => train.trainNumber === updatedTrain.trainNumber
          )

          if (matchingTrain === undefined) {
            return trains
          }

          const newTrains = getNewTrains(
            trains,
            updatedTrain,
            stationShortCode,
            stations,
            type
          )

          return trainsInFuture(newTrains)
        })
      }
    })()

    return function cleanup() {
      client.close()
      client.trains.return()
    }
  }, [client, setTrains, stationShortCode, stations, type])
}
