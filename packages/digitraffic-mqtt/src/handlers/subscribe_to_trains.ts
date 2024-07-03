import type { Train } from '@junat/digitraffic/types'
import type { HandlerReturn } from '../base/create_handler.js'
import type { MessageGeneratorResult } from '../base/message_generator.js'

import mqtt from 'mqtt'

import { close } from '../base/close.js'
import { createHandler } from '../base/create_handler.js'
import { getMqttTopicString } from '../base/get_mqtt_topic_string.js'
import { messageGenerator } from '../base/message_generator.js'
import { MQTT_URL } from '../constants/index.js'

export interface TrainsMqttClient extends HandlerReturn {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of AsyncGenerator} that wraps the MQTT subscription and yields updated trains.
   *
   * @see {@link MessageGeneratorResult} for usage example.
   */
  trains: MessageGeneratorResult<Train>
}

export interface SubscribeToTrainsOptions {
  /**
   * Date of departure. In {@link https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates ISO 8601 extended date} format.
   */
  departureDate?: string
  /**
   * When specified, only listens to a single train.
   * Omit to listen to all trains.
   */
  trainNumber?: number
  /**
   * Comma separated list of trains, e.g. "Long-Distance,Commuter"
   * @see https://rata.digitraffic.fi/api/v1/metadata/train-categories
   */
  trainCategory?: string
  /**
   * @see https://rata.digitraffic.fi/api/v1/metadata/train-types
   * Specifically `name`. You can also use the `trainCategory` option instead.
   */
  trainType?: string
  /**
   * @see https://rata.digitraffic.fi/api/v1/metadata/operators
   * Same as {@link Train `operatorShortCode`} exported from @junat/digitraffic.
   */
  operator?: string
  /**
   * Same as {@link Train `commuterLineID`} exported from @junat/digitraffic
   */
  commuterLine?: string
  runningCurrently?: string
  timetableType?: string
}

const trains = async (options: SubscribeToTrainsOptions = {}) => {
  return new Promise<TrainsMqttClient>((resolve, reject) => {
    const client = mqtt.connect(MQTT_URL)

    client.subscribe(getMqttTopicString('trains/', options), { qos: 0 })

    client.on('connect', () => {
      resolve({
        trains: messageGenerator(client),
        close: () => close(client),
        mqttClient: client,
      })
    })

    client.on('error', err => reject(err))
  })
}

/**
 * Subscribes to all trains or a single train.
 */
export const subscribeToTrains = createHandler(trains)
