import type { MqttClient } from 'mqtt'

export interface HanderReturn {
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

export const createHandler = <
  T extends (...args: Parameters<T>) => Promise<HanderReturn>
>(
  fn: T
) => {
  return fn
}
