import type { MqttClient } from 'mqtt'
import type { Train } from '~digitraffic'
import type { MessageGeneratorResult } from '../types/message_generator_result'

export async function* messageGenerator<T extends Train>(
  client: MqttClient
): MessageGeneratorResult<T> {
  if (!client.connected) {
    throw new Error('Client must be connected.')
  }

  while (true) {
    if (client.disconnected || client.disconnecting) {
      break
    }

    yield new Promise<T>((resolve, _reject) => {
      client.prependOnceListener('message', (_topic, payload) => {
        resolve(JSON.parse(payload.toString()))
      })
    })
  }
}
