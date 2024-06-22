import type { HandlerReturn } from '../base/create_handler.js'
import type { MessageGeneratorResult } from '../base/message_generator.js'

import mqtt from 'mqtt'

import { close } from '../base/close.js'
import { createHandler } from '../base/create_handler.js'
import { messageGenerator } from '../base/message_generator.js'

import type { Train } from '@junat/digitraffic/types'
import { MQTT_URL } from '../constants/index.js'

export interface StationMqttClient extends HandlerReturn {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of AsyncGenerator} that wraps the MQTT subscription and yields updated trains.
   *
   * @see {@link MessageGeneratorResult} for usage example.
   */
  trains: MessageGeneratorResult<Train>
}

export const station = async (
  stationShortCode: string
): Promise<StationMqttClient> => {
  return new Promise(async (resolve, reject) => {
    const client = mqtt.connect(MQTT_URL)
    const topicString = `trains-by-station/${stationShortCode}`

    client.subscribe(topicString, { qos: 0 })

    client.on('connect', () => {
      resolve({
        trains: messageGenerator(client),
        close: () => close(client),
        mqttClient: client
      })
    })

    client.on('error', err => reject(err))
  })
}

/**
 * Listens to trains that travel through or stop at `stationShortCode`.
 */
export const subscribeToStation = createHandler(station)
