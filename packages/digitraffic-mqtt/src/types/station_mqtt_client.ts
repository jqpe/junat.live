import type { MqttClient } from 'mqtt'
import type { Train } from '@junat/digitraffic'

import type { MessageGeneratorResult } from './message_generator_result'

export interface StationMqttClient {
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
  /**
   * Closes the underlying MQTT connection.
   */
  close: () => Promise<boolean>
  /**
   * This class is exported for testing purposes. Other APIs returned by `subscribeToStation` are an abstraction over this,
   * but are declarative in nature.
   *
   * Avoid accessing this class wherever possible and use the other exported APIs instead of calling methods here directly.
   *
   * If you know what you're doing:
   * @see https://github.com/mqttjs/MQTT.js
   */
  mqttClient: MqttClient
}
