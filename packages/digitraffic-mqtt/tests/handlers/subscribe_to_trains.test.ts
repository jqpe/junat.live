import type { Train } from '@junat/digitraffic/types'
import type { TrainsMqttClient } from '../../src/handlers/subscribe_to_trains'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { subscribeToTrains } from '../../src'

describe('subscribe to trains', () => {
  let client: TrainsMqttClient

  beforeAll(async () => {
    client = await subscribeToTrains()
  })

  it('connects', () => {
    expect(client.mqttClient.connected).toStrictEqual(true)
  })

  it('is subscribed to all trains by default', async () => {
    const { topic } = await subscribeToTrains()

    expect(topic).contain('trains/#')
  })

  it(
    'listens to multiple trains',
    async () => {
      const train1 = (await client.trains.next()).value as Train
      const train2 = (await client.trains.next()).value as Train

      expect(train1.trainNumber + (train1.version ?? 0)).not.toStrictEqual(
        train2.trainNumber + (train2.version ?? 0),
      )
    },
    new Date(0).setMinutes(10),
  )

  it('respects train number parameter', async () => {
    const { topic } = await subscribeToTrains({ trainNumber: 1 })

    expect(topic).contain('trains/+/1/+/+/+/+/+/+')
  })

  it('closes', async () => {
    expect(await client.close()).toStrictEqual(true)
  })

  afterAll(async () => {
    if (!(client.mqttClient.disconnected || client.mqttClient.disconnecting)) {
      await client.close()
    }
  })
})
