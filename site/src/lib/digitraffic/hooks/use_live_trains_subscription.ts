import type { LocalizedStation } from '@lib/digitraffic'
import type { SimplifiedTrain } from '@typings/simplified_train'

import React from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNewTrains, trainsInFuture } from '@utils/train'

interface UseLiveTrainsSubscriptionProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  stations: LocalizedStation[]
  queryKey: unknown[]
}

const LIVE_TRAINS_CLIENT_QUERY_KEY = 'live-trains-mqtt'

export const useLiveTrainsSubscription = ({
  stationShortCode,
  stations,
  type = 'DEPARTURE',
  queryKey
}: UseLiveTrainsSubscriptionProps): void => {
  const queryClient = useQueryClient()
  const trains = queryClient.getQueryData<SimplifiedTrain[]>(queryKey)

  const { data: client, isPreviousData } = useQuery(
    [LIVE_TRAINS_CLIENT_QUERY_KEY, stationShortCode],
    async () => {
      const { subscribeToStation } = await import('@junat/digitraffic-mqtt')

      return await subscribeToStation(stationShortCode)
    },
    { staleTime: Infinity, keepPreviousData: true, cacheTime: 0 }
  )

  React.useMemo(() => {
    if (isPreviousData) {
      client?.close()
      client?.trains.return()
    }
  }, [client, isPreviousData])

  React.useEffect(() => {
    if (!client) {
      return
    }

    ;(async () => {
      for await (const updatedTrain of client.trains) {
        queryClient.setQueryData<SimplifiedTrain[]>(queryKey, trains => {
          if (!trains) {
            return
          }

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
  }, [client, stationShortCode, stations, type, trains, queryClient, queryKey])
}
