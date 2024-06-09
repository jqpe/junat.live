import type { MqttClient } from 'mqtt'
import type { GpsLocation, Train } from '@junat/digitraffic/types'

export type MessageGeneratorResult<T> = AsyncGenerator<T, void, unknown>

/**
 * Listens to any updates from the MQTT API and yields updated results.
 *
 * ### Notice!
 * This will run indefinitely (if all goes swell) so remember to finish the generator with either `.return()`
 * or `.throw("error")`, not doing so will most likely wind up in memory leaks.
 *
 * ---
 *
 * @example
 * Consuming trains with a for-loop
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
export async function* messageGenerator<T extends Train | GpsLocation>(
  client: MqttClient
): MessageGeneratorResult<T> {
  if (!client.connected) {
    throw new Error('Client must be connected.')
  }

  while (true) {
    if (client.disconnected || client.disconnecting) {
      break
    }

    yield new Promise<T>(resolve => {
      client.prependOnceListener('message', (_topic, payload) => {
        resolve(JSON.parse(payload.toString()))
      })
    })
  }
}
