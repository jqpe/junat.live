import type { GpsLocation } from '~digitraffic'
import type { TrainLocationsMqttClient } from '~digitraffic-mqtt'

import { useEffect, useState } from 'react'
import { subscribeToTrainLocations } from '~digitraffic-mqtt'

interface UseTrainLocationsProps {
  departureDate?: string
  trainNumber?: number
}

export default function useTrainLocations({
  departureDate,
  trainNumber
}: UseTrainLocationsProps = {}) {
  const [locations, setLocations] = useState<GpsLocation[]>([])
  const [client, setClient] = useState<TrainLocationsMqttClient>()

  useEffect(() => {
    if (!client) {
      subscribeToTrainLocations({ departureDate, trainNumber }).then(client =>
        setClient(client)
      )
      return
    }

    ;(async () => {
      for await (const location of client.locations) {
        console.log('new location', location)

        setLocations(locations => [location, ...locations])
      }
    })()

    return function cleanup() {
      client.close()
      client.locations.return()
    }
  }, [departureDate, trainNumber, client])

  return locations
}
