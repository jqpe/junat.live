import type { MqttClient } from 'mqtt'
import type { Train } from '@junat/digitraffic/types'

import { matches } from 'mqtt-pattern'

export type MessageGeneratorResult<T> = AsyncGenerator<T, void, unknown>

/**
 * Listens to any updates from the MQTT API and yields updated results.
 *
 * ### Notice!
 * This will run indefinitely (if all goes swell) so remember to finish the generator with either `.return()`
 * or `.throw("error")`, not doing so will most likely wind up in memory leaks.
 * The generator also cleans up after itself when the client is disconnected.
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
export async function* messageGenerator<T extends Train>(
  client: MqttClient,
  topic: string,
): MessageGeneratorResult<T> {
  if (!client.connected) {
    throw new Error('Client must be connected.')
  }

  const messageQueue: T[] = []
  let resolveNext: ((value: T) => void) | null = null

  const messageHandler = (_topic: string, payload: Buffer) => {
    if (!matches(topic, _topic)) {
      return
    }

    const message = JSON.parse(payload.toString()) as T

    if (resolveNext) {
      resolveNext(message)
      resolveNext = null
    } else {
      messageQueue.push(message)
    }
  }

  client.on('message', messageHandler)

  try {
    while (!client.disconnecting && !client.disconnected) {
      if (messageQueue.length > 0) {
        yield messageQueue.shift()!
      } else {
        const message = await new Promise<T>(resolve => {
          resolveNext = resolve
        })
        yield message
      }
    }
  } finally {
    client.removeListener('message', messageHandler)
  }
}
