import type { MqttClient } from 'mqtt'

/**
 * @internal
 */
export interface CloseFn {
  (client: MqttClient): Promise<boolean>
}

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
