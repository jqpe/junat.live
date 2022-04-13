import type { StationMqttClient } from '~digitraffic-mqtt'
import type { SimplifiedTrain } from '@typings/simplified_train'
import type { Dispatch, SetStateAction } from 'react'

import { subscribeToStation } from '~digitraffic-mqtt'

import { useEffect, useState } from 'react'

import { useStationsQuery } from 'src/features/stations/stations_slice'
import { simplifyTrain } from '@utils/simplify_train'

interface UseLiveTrainsProps {
  stationShortCode: string
  initialTrains: SimplifiedTrain[]
}

export default function useLiveTrains({
  stationShortCode,
  initialTrains
}: UseLiveTrainsProps): [
  SimplifiedTrain[],
  Dispatch<SetStateAction<SimplifiedTrain[]>>
] {
  const [trains, setTrains] = useState<SimplifiedTrain[]>(initialTrains)
  const [client, setClient] = useState<StationMqttClient>()

  const { data: stations } = useStationsQuery()

  useEffect(() => {
    if (!client) {
      subscribeToStation({ stationShortCode }).then(client => setClient(client))
      return
    }

    if (!stations) {
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

          const newTrains = trains.map(train => {
            if (
              train.trainNumber === updatedTrain.trainNumber &&
              train.scheduledTime ===
                updatedTrain.timeTableRows.find(
                  tr =>
                    tr.stationShortCode === stationShortCode &&
                    tr.type === 'DEPARTURE'
                )?.scheduledTime
            ) {
              const t = simplifyTrain(updatedTrain, stationShortCode, stations)

              return { t, ...train }
            }

            return train
          })

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
