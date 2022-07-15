import mqtt from 'mqtt'

import { hasConnected } from '../base/has_connected'
import {
  messageGenerator,
  MessageGeneratorResult
} from '../base/message_generator'
import { close } from '../base/close'
import { createHandler, HanderReturn } from '../base/create_handler'

import { MQTT_URL } from '../constants'
import { Train } from '@junat/digitraffic/types'

export interface TrainsMqttClient extends HanderReturn {
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

/**
 * Subscribes to all trains or a single train.
 */
export const subscribeToTrains = createHandler(trains)
