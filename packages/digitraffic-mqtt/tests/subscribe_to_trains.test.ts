import type { Train } from '~digitraffic'
import type { MqttClient } from 'mqtt'

import type { TrainsMqttClient } from '../src/types/train_mqtt_client'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { subscribeToTrains } from '../src'

describe('subscribe to trains', () => {
  let client: TrainsMqttClient

  beforeAll(async () => {
    client = await subscribeToTrains()
  })

  it('connects', () => {
    expect(client.mqttClient.connected).toStrictEqual(true)
  })

  // These properties exist but aren't typed by MQTT.js
  interface EnchancedClient extends MqttClient {
    messageIdToTopic: Record<string, string[]>
  }

  it('is subscribed to all trains by default', () => {
    const enhancedClient = client.mqttClient as EnchancedClient

    const id = Object.keys(enhancedClient.messageIdToTopic)[0]
    const topic = enhancedClient.messageIdToTopic[id]

    expect(topic).contain('trains/#')
  })

  it(
    'listens to multiple trains',
    async () => {
      const train1 = (await client.trains.next()).value as Train
      const train2 = (await client.trains.next()).value as Train

      expect(train1.trainNumber).not.toStrictEqual(train2.trainNumber)
    },
    new Date(0).setMinutes(10)
  )

  it('closes', async () => {
    expect(await client.close()).toStrictEqual(true)
  })

  afterAll(async () => {
    if (!(client.mqttClient.disconnected || client.mqttClient.disconnecting)) {
      await client.close()
    }
  })
})
