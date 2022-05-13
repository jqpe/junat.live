import type { MqttClient } from 'mqtt'
import type { GpsLocation, Train } from '~digitraffic'
import type { MessageGeneratorResult } from '../types/message_generator_result'

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
