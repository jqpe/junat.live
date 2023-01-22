import type { SimplifiedTrain } from '@typings/simplified_train'

import { it, expect, describe } from 'vitest'

import { LOCALES } from '../../src/constants/locales'
import {
  sortSimplifiedTrains,
  getTrainType,
  simplifyTrains,
  simplifyTrain,
  Codes
} from '@utils/train'

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

const date = new Date().toISOString()

const stations: Station[] = [
  { stationName: { en: '1', fi: '2', sv: '3' }, stationShortCode: DESTINATION }
]

const TRAINS = [
  { scheduledTime: date, trainNumber: 1 },
  { scheduledTime: date, trainNumber: 2 }
] as const

describe('sort simplified trains', () => {
  it("doesn't sort trains if they're already sorted", () => {
    expect(sortSimplifiedTrains(TRAINS)).toStrictEqual(TRAINS)
  })

  it('sorts trains by date (oldest first)', () => {
    const now = new Date().toISOString()

    const trains = [{ ...TRAINS[0], scheduledTime: now }, TRAINS[0]]

    expect(sortSimplifiedTrains(trains)[0].scheduledTime).toStrictEqual(date)
  })
})

describe('simplify trains', () => {
  it('returns a simplifed train', () => {
    hasExpectedProperties(simplifyTrain(TRAIN, DESTINATION, stations))
  })

  it('works with arrays with simplify trains function', () => {
    const trains = simplifyTrains([TRAIN], DESTINATION, stations)

    expect(trains).toHaveLength(1)

    hasExpectedProperties(trains)
  })
})

describe('get train type', () => {
  it.each([
    'AE',
    'HDM',
    'HL',
    'HLV',
    'HSM',
    'HV',
    'IC',
    'LIV',
    'MUS',
    'MUV',
    'MV',
    'P',
    'PAI',
    'PVV',
    'PYO',
    'S',
    'SAA',
    'T',
    'TYO',
    'VET',
    'VEV',
    'VLI',
    'V'
  ] as Codes)('%s works', code => {
    for (const locale of LOCALES) {
      expect(() => getTrainType(code, locale)).not.toThrow()
    }
  })
})

function hasExpectedProperties(train: SimplifiedTrain | SimplifiedTrain[]) {
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
