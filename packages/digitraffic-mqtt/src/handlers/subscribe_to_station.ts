import type { MessageGeneratorResult } from '../types/message_generator_result'
import type { HanderReturn } from '../base/create_handler'

import mqtt from 'mqtt'

import { messageGenerator } from '../base/message_generator'
import { hasConnected } from '../base/has_connected'
import { close } from '../base/close'
import { createHandler } from '../base/create_handler'

import { MQTT_URL } from '../constants'
import { Train } from '@junat/digitraffic/types'

export interface StationMqttClient extends HanderReturn {
  /**
   * An asynchronous generator for trains. Listens to any updates from the MQTT API and yields updated trains.
   *
   * ### Notice!
   * This will run indefinitely (if all goes swell) so remember to finish the generator with either `trains.return()`
   * or `trains.throw("error")`, not doing so will most likely wind up in memory leaks.
   *
   * ---
   *
   * @example
   * ### Consuming trains with a for-loop
   *
   * ```
   * const client = await subscribeToStation({ stationShortCode: 'HKI' })
   *
   * for await (const train of client.trains) {
   *  console.log(train)
   * }
   *
   * // When you're done
   * client.trains.return()
   * ```
   */
  trains: MessageGeneratorResult<Train>
}

export const station = async ({
  stationShortCode
}: {
  stationShortCode: string
}): Promise<StationMqttClient> => {
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
