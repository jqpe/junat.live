import type { MqttClient } from 'mqtt'

import mqtt from 'mqtt'

import { MQTT_URL } from '../constants'

let client: Promise<MqttClient> | undefined

export function getClient(): Promise<MqttClient> {
  if (!client) {
    client = mqtt.connectAsync(MQTT_URL)
  }

  return client
}
