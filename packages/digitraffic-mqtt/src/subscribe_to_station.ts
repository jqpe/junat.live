import type { StationMqttClient } from './types/station_mqtt_client'

import mqtt from 'mqtt'

import { messageGenerator } from './utils/message_generator'
import { hasConnected } from './utils/has_connected'
import { close } from './utils/close'
import { MQTT_URL } from './constants'

/**
 * Listens to trains that travel through or stop at `stationShortCode`.
 */
export const subscribeToStation = async ({
  stationShortCode
}: {
  stationShortCode: string
}): Promise<StationMqttClient> => {
  return new Promise(async resolve => {
    const client = mqtt.connect(MQTT_URL)
    const topicString = `trains-by-station/${stationShortCode}`

    client.subscribe(topicString, { qos: 0 })

    await hasConnected(client)

    resolve({
      trains: messageGenerator(client),
      close: () => close(client),
      mqttClient: client
    })
  })
}
