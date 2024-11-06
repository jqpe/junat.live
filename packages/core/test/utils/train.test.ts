/* eslint-disable unicorn/no-array-callback-reference */
import type { TranslateFn } from '../../src/i18n'
import type { Code } from '../../src/utils/train'

import { describe, expect, it } from 'vitest'

import { LOCALES } from '../../src/constants'
import {
  getDestinationTimetableRow,
  getFutureTimetableRow,
  getTrainHref,
  getTrainType,
  hasLiveEstimateTime,
  hasLongTrainType,
  singleTimetableFilter,
  sortTrains,
  trainsInFuture,
} from '../../src/utils/train'

describe('get future timetable row', () => {
  const now = new Date()
  const past = new Date(now.getTime() - 1000 * 60 * 60) // 1 hour ago
  const future = new Date(now.getTime() + 1000 * 60 * 60) // 1 hour in the future

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

describe('get destination timetable row', () => {
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
})

type Locale = keyof typeof LOCALES

const translate: TranslateFn = locale => {
  return function getTranslatedValue(path) {
    const getLocale = (localeName: Omit<Locale, 'all'> = locale) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const json = require(`@junat/i18n/${localeName}.json`)
      return path.split('.').reduce((obj, key) => obj[key], json)
    }

    if (locale === 'all') {
      const locales = LOCALES.map(l => [l, getLocale(l)])

      return Object.fromEntries(locales)
    }

    return getLocale()
  }
}

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
  ] as const satisfies Code[])('%s works', code => {
    for (const locale of LOCALES) {
      const t = translate(locale)

      expect(() =>
        getTrainType(code, {
          train: t('train'),
          trainTypes: t('trainTypes'),
        }),
      ).not.toThrow()
    }
  })

  // We want to check this behavior as codes are often feeded from an API and new codes that are not included in our code should not break the functionality
  it('may return generic translation of train if code does not exist', () => {
    const t = translate('en')
    const i18n = { train: t('train'), trainTypes: t('trainTypes') } as const

    // @ts-expect-error ANY is not a predefined code
    expect(() => getTrainType('ANY', i18n)).not.toThrow()
    // @ts-expect-error ANY is not a predefined code
    expect(getTrainType('ANY', i18n)).toStrictEqual(t('train'))
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockTranslate: any = (key: string) => key

describe('getTrainHref', () => {
  it('returns the correct href for a train departing today', () => {
    const today = new Date().toISOString().split('T')[0]
    const result = getTrainHref(mockTranslate, today, 123)
    expect(result).toBe('/routes.train/123')
  })

  it('returns the correct href for a train departing on a future date', () => {
    const futureDate = '2023-12-31'
    const result = getTrainHref(mockTranslate, futureDate, 456)
    expect(result).toBe('/routes.train/2023-12-31/456')
  })

  it('handles different train numbers correctly', () => {
    const date = '2023-06-15'
    const result = getTrainHref(mockTranslate, date, 789)
    expect(result).toBe('/routes.train/2023-06-15/789')
  })

  it('uses the provided translation function', () => {
    const result = getTrainHref(mockTranslate, '2023-06-15', 101)
    expect(result).toContain('routes.train')
  })

  it('handles date at the day boundary', () => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const result = getTrainHref(mockTranslate, today.toISOString(), 202)
    expect(result).toBe('/routes.train/202')
  })
})

describe('hasLiveEstimateTime', () => {
  const scheduledTime = '2023-05-01T12:00:00.000Z'

  it('returns false when liveEstimateTime is undefined', () => {
    const train = {
      scheduledTime: scheduledTime,
    }
    expect(hasLiveEstimateTime(train)).toBe(false)
  })

  it('returns false when liveEstimateTime is the same as scheduledTime', () => {
    const train = {
      liveEstimateTime: scheduledTime,
      scheduledTime: scheduledTime,
    }
    expect(hasLiveEstimateTime(train)).toBe(false)
  })

  it('returns true when liveEstimateTime is different from scheduledTime', () => {
    const train = {
      liveEstimateTime: '2023-05-01T12:15:00.000Z',
      scheduledTime: scheduledTime,
    }
    expect(hasLiveEstimateTime(train)).toBe(true)
  })

  it('handles different date formats correctly', () => {
    const train = {
      liveEstimateTime: '2023-05-01T12:00:00+03:00',
      scheduledTime: '2023-05-01T09:00:00Z',
    }
    expect(hasLiveEstimateTime(train)).toBe(false)
  })

  it('returns true for small time differences (minutes)', () => {
    const train = {
      liveEstimateTime: '2023-05-01T12:01:00.000Z',
      scheduledTime: scheduledTime,
    }
    expect(hasLiveEstimateTime(train)).toBe(true)
  })
})

describe('hasLongTrainType', () => {
  it('returns true for long train type without commuterLineID', () => {
    const train = { trainType: 'IC', trainNumber: 12_345 }
    expect(hasLongTrainType(train)).toBe(true)
  })

  it('returns false for short train type without commuterLineID', () => {
    const train = { trainType: 'S', trainNumber: 123 }
    expect(hasLongTrainType(train)).toBe(false)
  })

  it('returns false when commuterLineID is present', () => {
    const train = { commuterLineID: 'A', trainType: 'IC', trainNumber: 12_345 }
    expect(hasLongTrainType(train)).toBe(false)
  })

  it('handles edge case with empty trainType', () => {
    const train = { trainType: '', trainNumber: 123_456 }
    expect(hasLongTrainType(train)).toBe(true)
  })

  it('handles edge case with zero trainNumber', () => {
    const train = { trainType: 'IC', trainNumber: 0 }
    expect(hasLongTrainType(train)).toBe(false)
  })
})

describe('singleTimetableFilter', () => {
  it('returns a predicate function', () => {
    const filter = singleTimetableFilter('DEPARTURE', [])
    expect(typeof filter).toBe('function')
  })

  it('filters commercial stops for departure', () => {
    const rows = [
      { type: 'DEPARTURE', commercialStop: true },
      { type: 'ARRIVAL', commercialStop: true },
      { type: 'DEPARTURE', commercialStop: false },
      { type: 'DEPARTURE', commercialStop: true },
    ] as const

    const filter = singleTimetableFilter('DEPARTURE', rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ type: 'DEPARTURE', commercialStop: true })
    expect(result[1]).toEqual({ type: 'DEPARTURE', commercialStop: true })
  })

  it('filters commercial stops for arrival', () => {
    const rows = [
      { type: 'ARRIVAL', commercialStop: true },
      { type: 'DEPARTURE', commercialStop: true },
      { type: 'ARRIVAL', commercialStop: false },
      { type: 'ARRIVAL', commercialStop: true },
    ] as const

    const filter = singleTimetableFilter('ARRIVAL', rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ type: 'ARRIVAL', commercialStop: true })
    expect(result[1]).toEqual({ type: 'ARRIVAL', commercialStop: true })
  })

  it('includes the last row if it is a commercial stop, regardless of type', () => {
    const rows = [
      { type: 'DEPARTURE', commercialStop: true },
      { type: 'ARRIVAL', commercialStop: true },
    ] as const

    const filter = singleTimetableFilter('DEPARTURE', rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ type: 'DEPARTURE', commercialStop: true })
    expect(result[1]).toEqual({ type: 'ARRIVAL', commercialStop: true })
  })

  it('handles empty array', () => {
    const filter = singleTimetableFilter('DEPARTURE', [])
    const result = [].filter(filter)
    expect(result).toHaveLength(0)
  })

  it('handles array with no matching rows', () => {
    const rows = [
      { type: 'ARRIVAL', commercialStop: false },
      { type: 'DEPARTURE', commercialStop: false },
    ] as const

    const filter = singleTimetableFilter('DEPARTURE', rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(0)
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

/**
 * # Test helper
 */
function createTimetableRow(
  stationShortCode: string,
  scheduledTime: Date,
  type: 'DEPARTURE' | 'ARRIVAL',
  commercialTrack?: string,
) {
  return {
    stationShortCode,
    scheduledTime: scheduledTime.toISOString(),
    type,
    commercialTrack,
  }
}

describe('trains in future', () => {
  const mockTrain = {
    departureDate: '2024-01-01',
    timeTableRows: [
      {
        scheduledTime: '2024-01-01T12:00:00.000Z',
        stationShortCode: 'HKI',
        type: 'DEPARTURE' as const,
      },
      {
        scheduledTime: '2024-01-01T13:00:00.000Z',
        stationShortCode: 'TPE',
        type: 'ARRIVAL' as const,
      },
    ],
  }

  it('filters out trains in the past', () => {
    const pastTrain = {
      ...mockTrain,
      timeTableRows: mockTrain.timeTableRows.map(row => ({
        ...row,
        scheduledTime: '2020-01-01T12:00:00.000Z',
      })),
    }

    const result = trainsInFuture([pastTrain], 'HKI', 'DEPARTURE')
    expect(result).toHaveLength(0)
  })

  it('keeps trains with future scheduled times', () => {
    const futureTrain = {
      ...mockTrain,
      timeTableRows: mockTrain.timeTableRows.map(row => ({
        ...row,
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      })),
    }

    const result = trainsInFuture([futureTrain], 'HKI', 'DEPARTURE')
    expect(result).toHaveLength(1)
  })

  it('uses liveEstimateTime over scheduledTime when available', () => {
    const train = {
      ...mockTrain,
      timeTableRows: mockTrain.timeTableRows.map(row => ({
        ...row,
        scheduledTime: '2020-01-01T12:00:00.000Z',
        liveEstimateTime: new Date(Date.now() + 3600000).toISOString(),
      })),
    }

    const result = trainsInFuture([train], 'HKI', 'DEPARTURE')
    expect(result).toHaveLength(1)
  })

  it('returns empty array when no matching station is found', () => {
    const result = trainsInFuture([mockTrain], 'XXX', 'DEPARTURE')
    expect(result).toHaveLength(0)
  })

  it('filters by station and type correctly', () => {
    const result = trainsInFuture([mockTrain], 'TPE', 'ARRIVAL')
    expect(result).toHaveLength(
      mockTrain.timeTableRows[1].scheduledTime > new Date().toISOString()
        ? 1
        : 0,
    )
  })
})
