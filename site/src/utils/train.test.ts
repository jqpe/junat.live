import type { SimplifiedTrain } from '@typings/simplified_train'

import { describe, expect, it } from 'vitest'

import {
  getFutureTimetableRow,
  getTrainType,
  simplifyTrain,
  simplifyTrains,
  sortSimplifiedTrains
} from '@utils/train'
import { LOCALES } from '../../src/constants/locales'
import translate from './translate'

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
  ] as const)('%s works', code => {
    for (const locale of LOCALES) {
      expect(() => getTrainType(code, locale)).not.toThrow()
    }
  })

  // We want to check this behavior as codes are often feeded from an API and new codes that are not included in our code should not break the functionality
  it('may return generic translation of train if code does not exist', () => {
    // @ts-expect-error ANY is not a predefined code
    expect(() => getTrainType('ANY', 'en')).not.toThrow()
    // @ts-expect-error ANY is not a predefined code
    expect(getTrainType('ANY', 'en')).toStrictEqual(translate('en')('train'))
  })
})

function hasExpectedProperties(t: SimplifiedTrain | SimplifiedTrain[]) {
  const train = Array.isArray(t) ? t[0] : t

  expect(train.cancelled).toBe(TRAIN.timeTableRows[1].cancelled)
  expect(train.destination).toStrictEqual(stations[0].stationName)
  expect(train.scheduledTime).toStrictEqual(
    TRAIN.timeTableRows[0].scheduledTime
  )

  // copied properties
  expect(train.trainType).toStrictEqual(TRAIN.trainType)
  expect(train.trainNumber).toStrictEqual(TRAIN.trainNumber)
  expect(train.version).toStrictEqual(TRAIN.version)
  expect(train.departureDate).toBe(TRAIN.departureDate)
}

describe('get future timetable row', () => {
  it('returns timetable row that is in the future', () => {
    const now = new Date()

    const second = 1000
    const minute = 60 * second
    const hourBefore = new Date(Date.now() - 60 * minute)

    const stationShortCode = 'PAS'
    const type = 'DEPARTURE'

    const timetableRows: {
      scheduledTime: string
      stationShortCode: string
      type: string
    }[] = [
      { scheduledTime: `${hourBefore}`, stationShortCode, type },
      { scheduledTime: `${now}`, stationShortCode, type }
    ]

    expect(
      getFutureTimetableRow(stationShortCode, timetableRows)
    ).toStrictEqual(timetableRows.at(1))
  })
})
