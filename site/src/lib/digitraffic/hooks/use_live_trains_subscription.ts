import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '@lib/digitraffic'
import type { Dispatch, SetStateAction } from 'react'
import type { Train } from '@junat/digitraffic/types'

import { useEffect, useState } from 'react'

import { simplifyTrain } from '@utils/train'
import { useQuery } from '@tanstack/react-query'

const getNewTrains = (
  trains: SimplifiedTrain[],
  updatedTrain: Train,
  stationShortCode: string,
  stations: LocalizedStation[],
  type: 'ARRIVAL' | 'DEPARTURE' = 'DEPARTURE'
) => {
  return trains.map(train => {
    if (
      train.trainNumber === updatedTrain.trainNumber &&
      train.scheduledTime ===
        updatedTrain.timeTableRows.find(
          tr => tr.stationShortCode === stationShortCode && tr.type === type
        )?.scheduledTime
    ) {
      const t = simplifyTrain(updatedTrain, stationShortCode, stations)

      return { t, ...train }
    }

    return train
  })
}

interface UseLiveTrainsSubscriptionProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  stations: LocalizedStation[] | undefined
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

  const clientQuery = useQuery([LIVE_TRAINS_CLIENT_QUERY_KEY], async () => {
    const { subscribeToStation } = await import('@junat/digitraffic-mqtt')

    return subscribeToStation(stationShortCode)
  })

  useEffect(() => {
    if (
      clientQuery.isFetching ||
      !clientQuery.data ||
      !stations ||
      stations.length === 0
    ) {
      return
    }
    const client = clientQuery.data

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

          return newTrains.filter(train => {
            return (
              Date.parse(train.liveEstimateTime || train.scheduledTime) >
              Date.now()
            )
          })
        })
      }
    })()

    return function cleanup() {
      client.close()
      client.trains.return()
    }
  }, [
    clientQuery.data,
    clientQuery.isFetching,
    stationShortCode,
    stations,
    type
  ])

  return [trains, setTrains]
}
