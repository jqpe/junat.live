import type { Train } from '@junat/digitraffic/types'
import type { HandlerReturn } from '../base/create_handler.js'
import type { MessageGeneratorResult } from '../base/message_generator.js'

import { getClient } from '../base/client.js'
import { close } from '../base/close.js'
import { createHandler } from '../base/create_handler.js'
import { messageGenerator } from '../base/message_generator.js'

export interface StationMqttClient extends HandlerReturn {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of AsyncGenerator} that wraps the MQTT subscription and yields updated trains.
   *
   * @see {@link MessageGeneratorResult} for usage example.
   */
  trains: MessageGeneratorResult<Train>
}

export const station = async (
  stationShortCode: string,
): Promise<StationMqttClient> => {
  const client = await getClient()
  const topic = `trains-by-station/${stationShortCode}`

  await client.subscribeAsync(topic, { qos: 0 })
  const channel = messageGenerator(client, topic)

  return {
    trains: channel,
    close: () => close(client),
    unsubscribe: () => {
      channel.return()
      return client.unsubscribeAsync(topic)
    },
    mqttClient: client,
  }
}

/**
 * Listens to trains that travel through or stop at `stationShortCode`.
 */
export const subscribeToStation = createHandler(station)
