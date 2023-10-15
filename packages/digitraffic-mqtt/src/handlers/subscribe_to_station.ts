import type { MessageGeneratorResult } from '~/base/message_generator'
import type { HandlerReturn } from '~/base/create_handler'

import mqtt from 'mqtt'

import { messageGenerator } from '~/base/message_generator'
import { hasConnected } from '~/base/has_connected'
import { close } from '~/base/close'
import { createHandler } from '~/base/create_handler'

import { MQTT_URL } from '~/constants/index'
import { Train } from '@junat/digitraffic/types'

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
  return new Promise(async resolve => {
    const client = mqtt.connect(MQTT_URL)
    const topicString = `trains-by-station/${stationShortCode}`

    client.subscribe(topicString, { qos: 0 })

    await hasConnected(client)

    resolve({
      trains: messageGenerator(client),
      close: () => close(client),
      mqttClient: client
    })
  })
}

/**
 * Listens to trains that travel through or stop at `stationShortCode`.
 */
export const subscribeToStation = createHandler(station)
