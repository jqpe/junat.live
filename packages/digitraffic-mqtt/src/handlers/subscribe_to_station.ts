import type { StationMqttClient } from '../types/station_mqtt_client'

import mqtt from 'mqtt'

import { messageGenerator } from '../base/message_generator'
import { hasConnected } from '../base/has_connected'
import { close } from '../base/close'
import { createHandler } from '../base/create_handler'

import { MQTT_URL } from '../constants'

export const station = async ({
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

/**
 * Listens to trains that travel through or stop at `stationShortCode`.
 */
export const subscribeToStation = createHandler(station)
