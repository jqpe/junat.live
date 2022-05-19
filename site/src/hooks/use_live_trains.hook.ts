import type { StationMqttClient } from '~digitraffic-mqtt'
import type { SimplifiedTrain } from '@typings/simplified_train'
import type { Dispatch, SetStateAction } from 'react'
import type { LocalizedStation } from '~digitraffic'

import { subscribeToStation } from '~digitraffic-mqtt'

import { useEffect, useState } from 'react'

import { simplifyTrain } from '@utils/simplify_train'
import { Train } from '~digitraffic'

const getNewTrains = (
  trains: SimplifiedTrain[],
  updatedTrain: Train,
  stationShortCode: string,
  stations: LocalizedStation[]
) => {
  return trains.map(train => {
    if (
      train.trainNumber === updatedTrain.trainNumber &&
      train.scheduledTime ===
        updatedTrain.timeTableRows.find(
          tr =>
            tr.stationShortCode === stationShortCode && tr.type === 'DEPARTURE'
        )?.scheduledTime
    ) {
      const t = simplifyTrain(updatedTrain, stationShortCode, stations)

      return { t, ...train }
    }

    return train
  })
}

interface UseLiveTrainsProps {
  stationShortCode: string
  stations: LocalizedStation[] | undefined
  initialTrains: SimplifiedTrain[]
}

export default function useLiveTrains({
  stationShortCode,
  stations,
  initialTrains
}: UseLiveTrainsProps): [
  SimplifiedTrain[],
  Dispatch<SetStateAction<SimplifiedTrain[]>>
] {
  const [trains, setTrains] = useState<SimplifiedTrain[]>(initialTrains)
  const [client, setClient] = useState<StationMqttClient>()

  useEffect(() => {
    if (!client) {
      subscribeToStation({ stationShortCode }).then(client => setClient(client))
      return
    }

    if (!stations || stations.length === 0) {
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
            stations
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
  }, [client, stationShortCode, stations])

  return [trains, setTrains]
}
