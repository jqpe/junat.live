import type { Train } from '@junat/digitraffic/types'

import type { StationMqttClient } from '../../src/types/station_mqtt_client'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { subscribeToStation } from '../../src/handlers/subscribe_to_station'

describe('subscribe to station', () => {
  let client: StationMqttClient

  beforeAll(async () => {
    client = await subscribeToStation({
      stationShortCode: 'HKI'
    })
  })

  it('connects', async () => {
    expect(client.mqttClient.connected).toStrictEqual(true)
  })

  describe('trains', () => {
    const trainsTimeout = new Date(0).setMinutes(10)

    it(
      'listens for trains',
      async () => {
        const train = await client.trains.next()

        expect((train.value as Train).trainNumber).toBeTypeOf('number')
      },
      trainsTimeout
    )

    it(
      'listens for multiple trains',
      async () => {
        const trains = await Promise.all([
          client.trains.next(),
          client.trains.next()
        ]).then(iterators => iterators.map(iterator => iterator.value as Train))

        const [train1, train2] = trains

        expect(train1).toBeDefined()
        expect(train2).toBeDefined()

        expect(`${train1.trainNumber} ${train1.version}`).not.toStrictEqual(
          `${train2.trainNumber} ${train2.version}`
        )
      },
      trainsTimeout
    )
  })

  // NOTE: Do not move this test as it will break some of the other tests.
  it('closes', async () => {
    expect(await client.close()).toStrictEqual(true)
  })

  // Used to close the connection if closes test is skipped for any reason.
  afterAll(async () => {
    client.trains.return()

    if (!(client.mqttClient.disconnected || client.mqttClient.disconnecting)) {
      await client.close()
    }
  })
})
