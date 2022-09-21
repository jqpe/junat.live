import type { SimplifiedTrain } from '@typings/simplified_train'

import { simplifyTrain, simplifyTrains } from '@utils/simplify_train'

import { it, expect } from 'vitest'

type Train = Parameters<typeof simplifyTrain>[0]
type Station = Parameters<typeof simplifyTrain>[2][number]

const DESTINATION = 'HKI' as const
const TYPES = ['DEPARTURE', 'ARRIVAL'] as const

const TRAIN: Readonly<Train> = {
  departureDate: '2022-01-01',
  timeTableRows: TYPES.map(type => ({
    stationShortCode: DESTINATION,
    cancelled: false,
    scheduledTime: new Date().toISOString(),
    type,
    commercialTrack: '1'
  })),
  trainNumber: 1,
  trainType: '',
  version: 1
}

const stations: Station[] = [
  { stationName: { en: '1', fi: '2', sv: '3' }, stationShortCode: DESTINATION }
]

const hasExpectedProperties = (train: SimplifiedTrain | SimplifiedTrain[]) => {
  const _train = Array.isArray(train) ? train[0] : train

  expect(_train.cancelled).toBe(TRAIN.timeTableRows[1].cancelled)
  expect(_train.destination).toStrictEqual(stations[0].stationName)
  expect(_train.scheduledTime).toStrictEqual(
    TRAIN.timeTableRows[0].scheduledTime
  )

  // copied properties
  expect(_train.trainType).toStrictEqual(TRAIN.trainType)
  expect(_train.trainNumber).toStrictEqual(TRAIN.trainNumber)
  expect(_train.version).toStrictEqual(TRAIN.version)
  expect(_train.departureDate).toBe(TRAIN.departureDate)
}

it('returns a simplifed train', () => {
  hasExpectedProperties(simplifyTrain(TRAIN, DESTINATION, stations))
})

it('works with arrays with simplify trains function', () => {
  const trains = simplifyTrains([TRAIN], DESTINATION, stations)

  expect(trains).toHaveLength(1)

  hasExpectedProperties(trains)
})
