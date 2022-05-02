import type { TrainsMqttClient } from '~digitraffic-mqtt'
import { getSingleTrain, Train } from '~digitraffic'

import { useEffect, useState } from 'react'
import { subscribeToTrains } from '~digitraffic-mqtt'

interface UseLiveTrainProps {
  trainNumber: number
  departureDate?: string
  /**
   * Train to update. If omitted a new train is fetched.
   */
  initialTrain?: Train
}

export default function useLiveTrain({
  trainNumber,
  departureDate,
  initialTrain
}: UseLiveTrainProps) {
  const [train, setTrain] = useState<Train>()
  const [client, setClient] = useState<TrainsMqttClient>()

  useEffect(() => {
    if (initialTrain) {
      setTrain(initialTrain)
      return
    }

    getSingleTrain({ date: departureDate ?? 'latest', trainNumber }).then(
      trains => setTrain(trains[0])
    )
  }, [departureDate, initialTrain, trainNumber])

  useEffect(() => {
    if (!client) {
      subscribeToTrains({ departureDate, trainNumber }).then(client =>
        setClient(client)
      )
      return
    }

    ;(async () => {
      for await (const train of client.trains) {
        setTrain(train)
      }
    })()

    return function cleanup() {
      client.close()
      client.trains.return()
    }
  }, [departureDate, trainNumber, client])

  return train
}
