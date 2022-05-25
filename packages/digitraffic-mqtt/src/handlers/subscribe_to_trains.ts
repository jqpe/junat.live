import type { SubscribeToTrainsOptions } from '../types/subscribe_to_trains_options'
import type { TrainsMqttClient } from '../types/train_mqtt_client'

import mqtt from 'mqtt'

import { hasConnected } from '../utils/has_connected'
import { messageGenerator } from '../utils/message_generator'
import { close } from '../utils/close'
import { MQTT_URL } from '../constants'

/**
 * Subscribes to all trains or a single train.
 */
export const subscribeToTrains = async (
  options: SubscribeToTrainsOptions = {}
) => {
  return new Promise<TrainsMqttClient>(async resolve => {
    const client = mqtt.connect(MQTT_URL)
    const hasArguments = Object.keys(options).length > 0

    let topicString = 'trains/' + (!hasArguments ? '#' : '')

    if (hasArguments) {
      const base = {
        departureDate: '+',
        trainNumber: '+',
        trainCategory: '+',
        trainType: '+',
        operator: '+',
        commuterLine: '+',
        runningCurrently: '+',
        timetableType: '+'
      }

      const merged = Object.assign(base, options)

      topicString += Object.values(merged).join('/')
    }

    client.subscribe(topicString, { qos: 0 })

    await hasConnected(client)

    resolve({
      trains: messageGenerator(client),
      close: () => close(client),
      mqttClient: client
    })
  })
}
