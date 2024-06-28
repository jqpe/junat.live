import { describe, expect, it } from 'vitest'

import { LOCALES } from '@junat/core/constants'

import { translate } from '~/i18n'
import {
  getDestinationTimetableRow,
  getFutureTimetableRow,
  getTrainType,
  sortTrains,
} from '~/utils/train'

import 'core-js/actual/array/at'

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
    'V',
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

describe('get future timetable row', () => {
  const now = new Date()
  const past = new Date(now.getTime() - 1000 * 60 * 60) // 1 hour ago
  const future = new Date(now.getTime() + 1000 * 60 * 60) // 1 hour in the future

  const createTimetableRow = (
    stationShortCode: string,
    scheduledTime: Date,
    type: 'DEPARTURE' | 'ARRIVAL',
    commercialTrack?: string,
  ) => ({
    stationShortCode,
    scheduledTime: scheduledTime.toISOString(),
    type,
    commercialTrack,
  })

  it('returns undefined when no matching rows are found', () => {
    const timetableRows = [
      createTimetableRow('HKI', past, 'DEPARTURE'),
      createTimetableRow('TKU', future, 'ARRIVAL'),
    ]

    const result = getFutureTimetableRow('TMP', timetableRows, 'DEPARTURE')
    expect(result).toBeUndefined()
  })

  it('returns the future row when both past and future rows exist', () => {
    const timetableRows = [
      createTimetableRow('HKI', past, 'DEPARTURE'),
      createTimetableRow('HKI', future, 'DEPARTURE'),
    ]

    const result = getFutureTimetableRow('HKI', timetableRows, 'DEPARTURE')
    expect(result).toEqual(timetableRows[1])
  })

  it('returns the last row when all rows are in the past', () => {
    const timetableRows = [
      createTimetableRow('HKI', past, 'DEPARTURE'),
      createTimetableRow('HKI', new Date(past.getTime() + 1000), 'DEPARTURE'),
    ]

    const result = getFutureTimetableRow('HKI', timetableRows, 'DEPARTURE')
    expect(result).toEqual(timetableRows[1])
  })

  it('returns undefined for cancelled trains in the past', () => {
    const timetableRows = [createTimetableRow('HKI', past, 'DEPARTURE', '')]

    const result = getFutureTimetableRow('HKI', timetableRows, 'DEPARTURE')
    expect(result).toBeUndefined()
  })

  it('returns the row for non-cancelled trains in the past', () => {
    const timetableRows = [createTimetableRow('HKI', past, 'DEPARTURE', '1')]

    const result = getFutureTimetableRow('HKI', timetableRows, 'DEPARTURE')
    expect(result).toEqual(timetableRows[0])
  })

  it('handles multiple departures from the same station', () => {
    const timetableRows = [
      createTimetableRow('HKI', past, 'DEPARTURE'),
      createTimetableRow('TMP', now, 'ARRIVAL'),
      createTimetableRow('TMP', future, 'DEPARTURE'),
      createTimetableRow(
        'HKI',
        new Date(future.getTime() + 1000 * 60 * 60),
        'DEPARTURE',
      ),
    ]

    const result = getFutureTimetableRow('HKI', timetableRows, 'DEPARTURE')
    expect(result).toEqual(timetableRows[3])
  })

  it('differentiates between DEPARTURE and ARRIVAL types', () => {
    const timetableRows = [
      createTimetableRow('HKI', past, 'DEPARTURE'),
      createTimetableRow('HKI', future, 'ARRIVAL'),
    ]

    const departureResult = getFutureTimetableRow(
      'HKI',
      timetableRows,
      'DEPARTURE',
    )
    expect(departureResult).toEqual(timetableRows[0])

    const arrivalResult = getFutureTimetableRow('HKI', timetableRows, 'ARRIVAL')
    expect(arrivalResult).toEqual(timetableRows[1])
  })

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
      { scheduledTime: `${now}`, stationShortCode, type },
    ]

    expect(
      getFutureTimetableRow(stationShortCode, timetableRows, type),
    ).toStrictEqual(timetableRows.at(1))
  })
})

describe('sort trains', () => {
  it.each([
    { type: 'DEPARTURE', msg: 'sorts trains by DEPARTURE' },
    { type: 'ARRIVAL', msg: 'sorts trains by ARRIVAL' },
  ] as const)('$msg', ({ type }) => {
    const now = new Date()

    const secsInFuture = { 30: 30_000, 10: 10_000, 20: 20_000 }

    function future(secs: keyof typeof secsInFuture) {
      return new Date(now.getTime() + secsInFuture[secs]).toISOString()
    }

    const trains = [
      {
        timeTableRows: [
          {
            scheduledTime: future(30),
            stationShortCode: 'HKI',
            type: 'DEPARTURE',
          },
          {
            scheduledTime: future(30),
            stationShortCode: 'HKI',
            type: 'ARRIVAL',
          },
        ],
      },
      {
        timeTableRows: [
          {
            scheduledTime: future(10),
            stationShortCode: 'HKI',
            type: 'DEPARTURE',
          },
          {
            scheduledTime: future(10),
            stationShortCode: 'HKI',
            type: 'ARRIVAL',
          },
        ],
      },
      {
        timeTableRows: [
          {
            scheduledTime: future(20),
            stationShortCode: 'HKI',
            type: 'DEPARTURE',
          },
          {
            scheduledTime: future(20),
            stationShortCode: 'HKI',
            type: 'ARRIVAL',
          },
        ],
      },
    ] as const

    const sorted = sortTrains(trains, 'HKI', type)

    function stime(index: number) {
      return sorted[index]!.timeTableRows[0].scheduledTime
    }
    function otime(index: number) {
      return trains[index]!.timeTableRows[0].scheduledTime
    }

    expect(stime(0)).toBe(otime(1))
    expect(stime(1)).toBe(otime(2))
    expect(stime(2)).toBe(otime(0))
  })

  it('does not modify the original array', () => {
    const trains = [
      {
        timeTableRows: [
          {
            scheduledTime: new Date(Date.now() * 1.1).toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE',
          },
        ],
      },
      {
        timeTableRows: [
          {
            scheduledTime: new Date().toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE',
          },
        ],
      },
    ] as const

    const trainsCopy = structuredClone(trains)

    sortTrains(trains, 'HKI', 'DEPARTURE')

    expect(trains).toStrictEqual(trainsCopy)
  })
})

const train = {
  timeTableRows: [
    { stationShortCode: 'HKI', type: 'DEPARTURE' },
    { stationShortCode: 'LEN', type: 'ARRIVAL' },
    { stationShortCode: 'LEN', type: 'DEPARTURE' },
    { stationShortCode: 'AIN', type: 'ARRIVAL' },
  ],
  commuterLineID: 'P',
} as const

const noCommuterLineId = { ...train, commuterLineID: undefined } as const

const [first, airport, last] = (() => {
  return [0, 1, -1].map(i => train.timeTableRows.at(i)?.stationShortCode)
})()

it('returns last timetable row if from is defined but commuter line id is undefined', () => {
  const tr = getDestinationTimetableRow(noCommuterLineId, first)

  expect(tr.stationShortCode).toBe(last)
})

it.each([train, { ...train, commuterLineID: 'I' }])(
  'always returns last timetable row if from is undefined or equal to LEN',
  trainMock => {
    const getTr = (from?: string) => {
      return getDestinationTimetableRow(trainMock, from).stationShortCode
    }

    expect(getTr()).toStrictEqual(last)
    expect(getTr('LEN')).toStrictEqual(last)
  },
)

it('returns airport if commuter line id is defined and from is not equal to LEN', () => {
  const { stationShortCode } = getDestinationTimetableRow(train, first)

  expect(stationShortCode).toStrictEqual(airport)
})

it("returns airport even if from doesn't exist in timetable rows", () => {
  const noFrom = {
    ...train,
    timeTableRows: train.timeTableRows.filter(
      tr => tr.stationShortCode !== first,
    ),
  } as const

  const { stationShortCode } = getDestinationTimetableRow(noFrom, first)

  expect(stationShortCode).toStrictEqual(airport)
})
