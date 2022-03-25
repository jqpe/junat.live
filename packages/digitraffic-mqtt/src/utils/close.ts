import type { MqttClient } from 'mqtt'
import type { CloseFn } from '../types/close'

/**
 * @private Waits for the client to close and then resolves with true.
 */
export const close: CloseFn = (client: MqttClient) => {
  return new Promise<boolean>(resolve => {
    if (client.disconnected) {
      return resolve(true)
    }

    client.end(false, () => resolve(true))
  })
}
