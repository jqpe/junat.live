import type { SubscribeToTrainLocationsOptions } from '../types/subscribe_to_train_locations_options'
import type { TrainLocationsMqttClient } from '../types/train_locations_mqtt_client'

import mqtt from 'mqtt'

import { hasConnected } from '../base/has_connected'
import { messageGenerator } from '../base/message_generator'
import { close } from '../base/close'
import { MQTT_URL } from '../constants'

/**
 * Subscribes to all trains' location updates or a single train's location updates.
 */
export const subscribeToTrainLocations = async (
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
