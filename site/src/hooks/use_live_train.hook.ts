import type { TrainsMqttClient } from '~digitraffic-mqtt'
import type { Train } from '~digitraffic'

import { useEffect, useState } from 'react'
import { subscribeToTrains } from '~digitraffic-mqtt'

interface UseLiveTrainsProps {
  trainNumber: number
  departureDate?: string
  /**
   * Train to update.
   */
  initialTrain: Train
}

export default function useLiveTrain({
  trainNumber,
  departureDate,
  initialTrain
}: UseLiveTrainsProps) {
  const [train, setTrain] = useState<Train>(initialTrain)
  const [client, setClient] = useState<TrainsMqttClient>()

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
