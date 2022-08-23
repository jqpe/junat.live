import type { SimplifiedTrain } from '@typings/simplified_train'
import type { LocalizedStation } from '@lib/digitraffic'
import type { Dispatch, SetStateAction } from 'react'
import type { Train } from '@junat/digitraffic/types'
import type { StationMqttClient } from '@junat/digitraffic-mqtt'

import { useEffect, useState } from 'react'

import { simplifyTrain } from '@utils/simplify_train'

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

interface UseStationTrainsProps {
  stationShortCode: string
  type?: 'DEPARTURE' | 'ARRIVAL'
  stations: LocalizedStation[] | undefined
  initialTrains: SimplifiedTrain[]
}

export const useStationTrains = ({
  stationShortCode,
  stations,
  initialTrains,
  type = 'DEPARTURE'
}: UseStationTrainsProps): [
  SimplifiedTrain[],
  Dispatch<SetStateAction<SimplifiedTrain[]>>
] => {
  const [trains, setTrains] = useState<SimplifiedTrain[]>(initialTrains)
  const [client, setClient] = useState<StationMqttClient>()

  useEffect(() => {
    if (!client) {
      import('@junat/digitraffic-mqtt')
        .then(({ subscribeToStation }) => subscribeToStation(stationShortCode))
        .then(setClient)

      return
    }

    if (!stations || stations.length === 0) {
      return
    }

    // prettier-ignore
    (async () => {
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
  }, [client, stationShortCode, stations, type])

  return [trains, setTrains]
}
