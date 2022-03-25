import { MqttClient } from 'mqtt'

export interface CloseFn {
  (client: MqttClient): Promise<boolean>
}
