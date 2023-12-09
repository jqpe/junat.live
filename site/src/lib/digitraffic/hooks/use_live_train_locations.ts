import {
  subscribeToTrainLocations,
  type TrainLocationsMqttClient
} from '@junat/digitraffic-mqtt'
import type { GpsLocation } from '@junat/digitraffic/types'
import React from 'react'

export const useLiveTrainLocations = (opts: { trainNumber?: number }) => {
  const [liveLocation, setLiveLocation] = React.useState<GpsLocation>()

  React.useEffect(() => {
    let client: TrainLocationsMqttClient

    if (opts.trainNumber) {
      ;(async () => {
        client = await subscribeToTrainLocations({
          trainNumber: opts.trainNumber,
          departureDate: '+'
        })

        for await (const location of client.locations) {
          setLiveLocation(location)
        }
      })()
    }

    return function cleanup() {
      client?.close()
    }
  }, [opts.trainNumber])

  return liveLocation
}
