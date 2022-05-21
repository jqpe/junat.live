import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import { getSingleTrain, Train } from '@junat/digitraffic'

import { useEffect, useState } from 'react'
import { subscribeToTrains } from '@junat/digitraffic-mqtt'

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
}: UseLiveTrainProps): [Train | undefined, Error | undefined] {
  const [train, setTrain] = useState<Train>()
  const [client, setClient] = useState<TrainsMqttClient>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (initialTrain) {
      setTrain(initialTrain)
      return
    }

    getSingleTrain({ date: departureDate ?? 'latest', trainNumber }).then(
      trains => {
        if (trains.length === 0) {
          return setError(new Error(`Train ${trainNumber} doesn't exist.`))
        }

        setTrain(trains[0])
      }
    )
  }, [departureDate, initialTrain, trainNumber])

  useEffect(() => {
    if (error) return

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
  }, [departureDate, trainNumber, client, error])

  return [train, error]
}
