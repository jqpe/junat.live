import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '@lib/digitraffic'
import type { Dispatch, SetStateAction } from 'react'

import { useEffect, useState } from 'react'

import { getNewTrains, trainsInFuture } from '@utils/train'
import { useQuery } from '@tanstack/react-query'

interface UseLiveTrainsSubscriptionProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  stations: LocalizedStation[]
  initialTrains: SimplifiedTrain[]
}

const LIVE_TRAINS_CLIENT_QUERY_KEY = 'live-trains-mqtt'

export const useLiveTrainsSubscription = ({
  stationShortCode,
  stations,
  initialTrains,
  type = 'DEPARTURE'
}: UseLiveTrainsSubscriptionProps): [
  SimplifiedTrain[],
  Dispatch<SetStateAction<SimplifiedTrain[]>>
] => {
  const [trains, setTrains] = useState<SimplifiedTrain[]>(initialTrains)

  const { data: client } = useQuery(
    [LIVE_TRAINS_CLIENT_QUERY_KEY],
    async () => {
      const { subscribeToStation } = await import('@junat/digitraffic-mqtt')

      return await subscribeToStation(stationShortCode)
    }
  )

  useEffect(() => {
    if (!client) {
      return
    }

    ;(async () => {
      for await (const updatedTrain of client.trains) {
        setTrains(oldTrains => {
          const matchingTrain = oldTrains.find(
            train => train.trainNumber === updatedTrain.trainNumber
          )

          if (matchingTrain === undefined) {
            return oldTrains
          }

          const newTrains = getNewTrains(
            oldTrains,
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
  }, [client, stationShortCode, stations, type])

  return [trains, setTrains]
}
