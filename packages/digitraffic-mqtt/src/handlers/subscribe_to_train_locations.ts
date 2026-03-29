import type { TrainLocation } from '@junat/digitraffic/types'
import type { HandlerReturn } from '../base/create_handler.js'
import type { MessageGeneratorResult } from '../base/message_generator.js'

import { getClient } from '../base/client.js'
import { close } from '../base/close.js'
import { createHandler } from '../base/create_handler.js'
import { messageGenerator } from '../base/message_generator.js'

export interface TrainLocationsMqttClient extends HandlerReturn {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of AsyncGenerator} that wraps the MQTT subscription and yields updated trains.
   *
   * @see {@link MessageGeneratorResult} for usage example.
   */
  locations: MessageGeneratorResult<TrainLocation>
}

export const trainLocations = async (
  departureDate?: string,
  trainNumber?: number,
): Promise<TrainLocationsMqttClient> => {
  const client = await getClient()
  const topic = `train-locations/${departureDate ?? '+'}/${trainNumber ?? '+'}`

  await client.subscribeAsync(topic, { qos: 0 })
  const channel = messageGenerator<TrainLocation>(client, topic)

  return {
    locations: channel,
    close: () => close(client),
    unsubscribe: () => {
      channel.return()
      return client.unsubscribeAsync(topic)
    },
    mqttClient: client,
  }
}

/**
 * Listens to train locations. Use parameters to listen to a subset of all locations.
 */
export const subscribeToTrainLocations = createHandler(trainLocations)
