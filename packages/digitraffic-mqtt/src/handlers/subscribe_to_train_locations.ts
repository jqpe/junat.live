import type { MessageGeneratorResult } from '../base/message_generator'
import type { GpsLocation } from '@junat/digitraffic/types'

import mqtt from 'mqtt'

import { hasConnected } from '../base/has_connected'
import { messageGenerator } from '../base/message_generator'
import { createHandler, HanderReturn } from '../base/create_handler'
import { close } from '../base/close'

import { MQTT_URL } from '../constants'

export interface TrainLocationsMqttClient extends HanderReturn {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of AsyncGenerator} that wraps the MQTT subscription and yields updated locations.
   *
   * @see {@link MessageGeneratorResult} for usage example.
   */
  locations: MessageGeneratorResult<GpsLocation>
}

export interface SubscribeToTrainLocationsOptions {
  departureDate?: string
  trainNumber?: number
}

export const trainLocations = async (
  options: SubscribeToTrainLocationsOptions = {}
) => {
  return new Promise<TrainLocationsMqttClient>(async resolve => {
    const client = mqtt.connect(MQTT_URL)
    const hasArguments = Object.keys(options).length > 0

    let topicString = 'train-locations/' + (!hasArguments ? '#' : '')

    if (hasArguments) {
      const base = {
        departureDate: '+',
        trainNumber: '+'
      }

      const merged = Object.assign(base, options)

      topicString += Object.values(merged).join('/')
    }

    client.subscribe(topicString, { qos: 0 })

    await hasConnected(client)

    resolve({
      locations: messageGenerator(client),
      close: () => close(client),
      mqttClient: client
    })
  })
}

/**
 * Subscribes to all trains' location updates or a single train's location updates.
 */
export const subscribeToTrainLocations = createHandler(trainLocations)
