import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type { Train } from '@junat/digitraffic/lib/types'

import { useEffect, useState } from 'react'

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
}: UseLiveTrainProps): Partial<[Train, Error]> {
  const [train, setTrain] = useState<Train>()
  const [client, setClient] = useState<TrainsMqttClient>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (initialTrain) {
      setTrain(initialTrain)
      return
    }

    import('@junat/digitraffic').then(({ fetchSingleTrain }) => {
      fetchSingleTrain({ date: departureDate ?? 'latest', trainNumber }).then(
        train => {
          if (train === undefined) {
            return setError(new Error(`Train ${trainNumber} doesn't exist.`))
          }

          setTrain(train)
        }
      )
    })
  }, [departureDate, initialTrain, trainNumber])

  useEffect(() => {
    if (error) return

    if (!client) {
      import('@junat/digitraffic-mqtt').then(({ subscribeToTrains }) => {
        subscribeToTrains({ departureDate, trainNumber }).then(client =>
          setClient(client)
        )
      })

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
