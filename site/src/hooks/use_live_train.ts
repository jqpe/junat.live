import type { TrainsMqttClient } from '@junat/digitraffic-mqtt'
import type { Train } from '@junat/digitraffic/types'

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
        updatedTrain => {
          if (updatedTrain === undefined) {
            setError(new Error(`Train ${trainNumber} doesn't exist.`))
          }

          setTrain(updatedTrain)
        }
      )
    })
  }, [departureDate, initialTrain, trainNumber])

  useEffect(() => {
    if (error) return

    if (!client) {
      import('@junat/digitraffic-mqtt').then(({ subscribeToTrains }) => {
        subscribeToTrains({ departureDate, trainNumber }).then(setClient)
      })

      return
    }

    // prettier-ignore
    (async () => {
      for await (const updatedTrain of client.trains) {
        setTrain(updatedTrain)
      }
    })()

    return function cleanup() {
      client.close()
      client.trains.return()
    }
  }, [departureDate, trainNumber, client, error])

  return [train, error]
}
