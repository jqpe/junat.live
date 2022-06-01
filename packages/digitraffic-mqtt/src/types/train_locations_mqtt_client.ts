import type { MqttClient } from 'mqtt'
import type { GpsLocation } from '@junat/digitraffic/lib/types'

import type { MessageGeneratorResult } from './message_generator_result'

export interface TrainLocationsMqttClient {
  /* An asynchronous generator for train locations. Listens to any updates from the MQTT API and yields updated train locations.
   *
   * ### Notice!
   * This will run indefinitely (if all goes swell) so remember to finish the generator with either `locations.return()`
   * or `locations.throw("error")`, not doing so will most likely wind up in memory leaks.
   *
   */
  locations: MessageGeneratorResult<GpsLocation>
  /**
   * Closes the underlying MQTT connection.
   */
  close: () => Promise<boolean>
  /**
   * This class is exported for testing purposes. Other APIs returned by `subscribeToTrainLocations` are an abstraction over this,
   * but are declarative in nature.
   *
   * Avoid accessing this class wherever possible and use the other exported APIs instead of calling methods here directly.
   *
   * If you know what you're doing:
   * @see https://github.com/mqttjs/MQTT.js
   */
  mqttClient: MqttClient
}
