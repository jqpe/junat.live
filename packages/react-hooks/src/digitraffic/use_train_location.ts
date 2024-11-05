import type { TrainLocationsMqttClient } from '@junat/digitraffic-mqtt'
import type { GpsLocation } from '@junat/digitraffic/types'

import React from 'react'

interface UseLiveTrainsSubscriptionProps {
  trainNumber: number
  departureDate: string
}

/** Creates a subscription for train location, tracking a single train */
export const useTrainLocationsSubscription = ({
  trainNumber,
  departureDate,
}: UseLiveTrainsSubscriptionProps): GpsLocation[] => {
  const [locations, setLocations] = React.useState<GpsLocation[]>([])
  const client = useMqttClient(trainNumber, departureDate)

  React.useEffect(() => {
    if (!client) return

    const startIterator = async () => {
      for await (const location of client.locations) {
        setLocations(prevLocations => [...prevLocations, location])
      }
    }

    startIterator()

    return function cleanup() {
      client.locations.return()
    }
  }, [client])

  return locations
}
const useMqttClient = (trainNumber: number, departureDate: string) => {
  const [client, setClient] = React.useState<TrainLocationsMqttClient>()
  const uid = React.useRef<string>()
  const uidFromParams = () => `${trainNumber}-${departureDate}`

  React.useEffect(() => {
    const createClient = async () => {
      const { subscribeToTrainLocations } = await import(
        '@junat/digitraffic-mqtt'
      )

      setClient(await subscribeToTrainLocations({ departureDate, trainNumber }))
      uid.current = uidFromParams()
    }

    if (uid.current !== uidFromParams()) {
      Promise.resolve(client?.close).then(createClient)
    }

    return function cleanup() {
      client?.close()
    }
  }, [client, trainNumber, departureDate])

  return client
}
