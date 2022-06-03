import type { MqttClient } from 'mqtt'
import type { CloseFn } from './close'

interface HanderReturn {
  close: CloseFn
  mqttClient: MqttClient
}

export const createHandler = <
  T extends (...args: Parameters<T>) => Promise<HanderReturn>
>(
  fn: T
) => {
  return fn
}
