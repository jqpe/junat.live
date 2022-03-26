import type { GpsLocation } from '~digitraffic'

import type { TrainLocationsMqttClient } from '../src/types/train_locations_mqtt_client'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { subscribeToTrainLocations } from '../src'

describe('subscribe to station', () => {
  let client: TrainLocationsMqttClient

  beforeAll(async () => {
    client = await subscribeToTrainLocations()
  })

  it('connects', async () => {
    expect(client.mqttClient.connected).toStrictEqual(true)
  })

  describe('train locations', () => {
    const trainLocationsTimeout = new Date(0).setMinutes(10)

    it(
      'listens for train location updates',
      async () => {
        const train = await client.locations.next()

        expect((train.value as GpsLocation).trainNumber).toBeTypeOf('number')
      },
      trainLocationsTimeout
    )

    it(
      'listens for multiple train location updates',
      async () => {
        const trainLocations = await Promise.all([
          client.locations.next(),
          client.locations.next()
        ]).then(iterators =>
          iterators.map(iterator => iterator.value as GpsLocation)
        )

        const [trainLocation1, trainLocation2] = trainLocations

        expect(trainLocation1).toBeDefined()
        expect(trainLocation2).toBeDefined()

        expect(trainLocation1.trainNumber).not.toStrictEqual(
          trainLocation2.trainNumber
        )
      },
      trainLocationsTimeout
    )
  })

  // NOTE: Do not move this test as it will break some of the other tests.
  it('closes', async () => {
    expect((await client.locations.return()).done).toStrictEqual(true)

    expect(await client.close()).toStrictEqual(true)
  })

  // Used to close the connection if closes test is skipped for any reason.
  afterAll(async () => {
    client.locations.return()

    if (!(client.mqttClient.disconnected || client.mqttClient.disconnecting)) {
      await client.close()
    }
  })
})
