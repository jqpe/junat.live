/* eslint-disable unicorn/no-array-callback-reference */
import type { TranslateFn } from '../../src/i18n'
import type { Code } from '../../src/utils/train'

import { describe, expect, it, vi } from 'vitest'

import { RowFragment, TimeTableRowType } from '@junat/graphql/digitraffic'

import { LOCALES } from '../../src/constants'
import {
  convertTrain,
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
      row('HKI', past, TimeTableRowType.Departure),
      row('TKU', future, TimeTableRowType.Arrival),
    ]

    const result = getFutureTimetableRow(
      'TMP',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(result).toBeUndefined()
  })

  it('returns the future row when both past and future rows exist', () => {
    const timetableRows = [
      row('HKI', past, TimeTableRowType.Departure),
      row('HKI', future, TimeTableRowType.Departure),
    ]

    const result = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(result).toEqual(timetableRows[1])
  })

  it('returns the last row when all rows are in the past', () => {
    const timetableRows = [
      row('HKI', past, TimeTableRowType.Departure),
      row('HKI', new Date(past.getTime() + 1000), TimeTableRowType.Departure),
    ]

    const result = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(result).toEqual(timetableRows[1])
  })

  it('returns undefined for cancelled trains in the past', () => {
    const timetableRows = [row('HKI', past, TimeTableRowType.Departure, '')]

    const result = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )

    expect(result).toBeUndefined()
  })

  it('returns the row for non-cancelled trains in the past', () => {
    const timetableRows = [row('HKI', past, TimeTableRowType.Departure, '1')]

    const result = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(result).toEqual(timetableRows[0])
  })

  it('handles multiple departures from the same station', () => {
    const timetableRows = [
      row('HKI', past, TimeTableRowType.Departure),
      row('TMP', now, TimeTableRowType.Arrival),
      row('TMP', future, TimeTableRowType.Departure),
      row(
        'HKI',
        new Date(future.getTime() + 1000 * 60 * 60),
        TimeTableRowType.Departure,
      ),
    ]

    const result = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(result).toEqual(timetableRows[3])
  })

  it('differentiates between DEPARTURE and ARRIVAL types', () => {
    const timetableRows = [
      row('HKI', past, TimeTableRowType.Departure),
      row('HKI', future, TimeTableRowType.Arrival),
    ]

    const departureResult = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Departure,
    )
    expect(departureResult).toEqual(timetableRows[0])

    const arrivalResult = getFutureTimetableRow(
      'HKI',
      timetableRows,
      TimeTableRowType.Arrival,
    )
    expect(arrivalResult).toEqual(timetableRows[1])
  })

  it('returns timetable row that is in the future', () => {
    const now = new Date()

    const second = 1000
    const minute = 60 * second
    const hourBefore = new Date(Date.now() - 60 * minute)

    const shortCode = 'PAS'
    const type = TimeTableRowType.Departure

    const timetableRows = [
      row(shortCode, hourBefore, type),
      row(shortCode, now, type),
    ]

    expect(getFutureTimetableRow(shortCode, timetableRows, type)).toStrictEqual(
      timetableRows.at(1),
    )
  })
})

describe('sort trains', () => {
  it.each([
    { type: TimeTableRowType.Departure, msg: 'sorts trains by DEPARTURE' },
    { type: TimeTableRowType.Arrival, msg: 'sorts trains by ARRIVAL' },
  ] as const)('$msg', ({ type }) => {
    const now = new Date()

    const secsInFuture = { 30: 30_000, 10: 10_000, 20: 20_000 }

    function future(secs: keyof typeof secsInFuture) {
      return new Date(now.getTime() + secsInFuture[secs])
    }

    const trains = [
      {
        timeTableRows: [
          row('HKI', future(30), TimeTableRowType.Departure),
          row('HKI', future(30), TimeTableRowType.Arrival),
        ],
      },
      {
        timeTableRows: [
          row('HKI', future(10), TimeTableRowType.Departure),
          row('HKI', future(10), TimeTableRowType.Arrival),
        ],
      },
      {
        timeTableRows: [
          row('HKI', future(20), TimeTableRowType.Departure),
          row('HKI', future(20), TimeTableRowType.Arrival),
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
          row('HKI', new Date(Date.now() * 1.1), TimeTableRowType.Departure),
        ],
      },
      {
        timeTableRows: [row('HKI', new Date(), TimeTableRowType.Departure)],
      },
    ] as const

    const trainsCopy = structuredClone(trains)

    sortTrains(trains, 'HKI', TimeTableRowType.Departure)

    expect(trains).toStrictEqual(trainsCopy)
  })
})

describe('get destination timetable row', () => {
  it('returns airport if commuter line id is defined and from is not equal to LEN', () => {
    const { station } = getDestinationTimetableRow(train, first)

    expect(station.shortCode).toStrictEqual(airport)
  })

  it('returns last timetable row if from is defined but commuter line id is undefined', () => {
    const tr = getDestinationTimetableRow(noCommuterLineId, first)

    expect(tr.station.shortCode).toBe(last)
  })

  it.each([train, { ...train, commuterLineID: 'I' }])(
    'always returns last timetable row if from is undefined or equal to LEN',
    trainMock => {
      const getRow = (from?: string) => {
        return getDestinationTimetableRow(trainMock, from).station.shortCode
      }

      expect(getRow()).toStrictEqual(last)
      expect(getRow('LEN')).toStrictEqual(last)
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

it('convert train', () => {
  const converted = convertTrain({
    cancelled: false,
    departureDate: '2020-05-01',
    operatorShortCode: '',
    operatorUICCode: 1,
    runningCurrently: false,
    timetableAcceptanceDate: '',
    timeTableRows: [],
    timetableType: 'ADHOC',
    trainCategory: 'Cargo',
    trainNumber: 1,
    trainType: '',
    version: 1,
    commuterLineID: undefined,
    deleted: undefined,
  })

  expect(converted).toMatchSnapshot()
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
    vi.setSystemTime(new Date('2024-01-01T23:59:59.999Z'))
    const result = getTrainHref(mockTranslate, new Date().toISOString(), 202)
    expect(result).toBe('/routes.train/202')
    vi.useRealTimers()
  })
})

describe('hasLiveEstimateTime', () => {
  const scheduledTime = '2023-05-01T12:00:00.000Z'

  it('returns false when liveEstimateTime is undefined', () => {
    const train = {
      scheduledTime: scheduledTime,
    }

    // @ts-expect-error liveEstimateTime should be undefined (not typed as such)
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
    const train = {
      trainType: { name: 'IC' },
      trainNumber: 12_345,
      commuterLineid: null,
    }
    expect(hasLongTrainType(train)).toBe(true)
  })

  it('returns false for short train type without commuterLineID', () => {
    const train = {
      trainType: { name: 'S' },
      trainNumber: 123,
      commuterLineid: null,
    }
    expect(hasLongTrainType(train)).toBe(false)
  })

  it('returns false when commuterLineID is present', () => {
    const train = {
      commuterLineid: 'A',
      trainType: { name: 'IC' },
      trainNumber: 12_345,
    }
    expect(hasLongTrainType(train)).toBe(false)
  })

  it('handles edge case with empty trainType', () => {
    const train = {
      trainType: { name: '' },
      trainNumber: 123_456,
      commuterLineid: null,
    }
    expect(hasLongTrainType(train)).toBe(true)
  })

  it('handles edge case with zero trainNumber', () => {
    const train = {
      trainType: { name: 'IC' },
      trainNumber: 0,
      commuterLineid: null,
    }
    expect(hasLongTrainType(train)).toBe(false)
  })
})

describe('singleTimetableFilter', () => {
  it('returns a predicate function', () => {
    const filter = singleTimetableFilter(TimeTableRowType.Departure, [])
    expect(typeof filter).toBe('function')
  })

  it('filters commercial stops for departure', () => {
    const rows = [
      { type: TimeTableRowType.Departure, commercialStop: true },
      { type: TimeTableRowType.Arrival, commercialStop: true },
      { type: TimeTableRowType.Departure, commercialStop: false },
      { type: TimeTableRowType.Departure, commercialStop: true },
    ] as const

    const filter = singleTimetableFilter(TimeTableRowType.Departure, rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      type: TimeTableRowType.Departure,
      commercialStop: true,
    })
    expect(result[1]).toEqual({
      type: TimeTableRowType.Departure,
      commercialStop: true,
    })
  })

  it('filters commercial stops for arrival', () => {
    const rows = [
      { type: TimeTableRowType.Arrival, commercialStop: true },
      { type: TimeTableRowType.Departure, commercialStop: true },
      { type: TimeTableRowType.Arrival, commercialStop: false },
      { type: TimeTableRowType.Arrival, commercialStop: true },
    ] as const

    const filter = singleTimetableFilter(TimeTableRowType.Arrival, rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      type: TimeTableRowType.Arrival,
      commercialStop: true,
    })
    expect(result[1]).toEqual({
      type: TimeTableRowType.Arrival,
      commercialStop: true,
    })
  })

  it('includes the last row if it is a commercial stop, regardless of type', () => {
    const rows = [
      { type: TimeTableRowType.Departure, commercialStop: true },
      { type: TimeTableRowType.Arrival, commercialStop: true },
    ] as const

    const filter = singleTimetableFilter(TimeTableRowType.Departure, rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      type: TimeTableRowType.Departure,
      commercialStop: true,
    })
    expect(result[1]).toEqual({
      type: TimeTableRowType.Arrival,
      commercialStop: true,
    })
  })

  it('handles empty array', () => {
    const filter = singleTimetableFilter(TimeTableRowType.Departure, [])
    const result = [].filter(filter)
    expect(result).toHaveLength(0)
  })

  it('handles array with no matching rows', () => {
    const rows = [
      { type: TimeTableRowType.Arrival, commercialStop: false },
      { type: TimeTableRowType.Departure, commercialStop: false },
    ] as const

    const filter = singleTimetableFilter(TimeTableRowType.Departure, rows)
    const result = rows.filter(filter)
    expect(result).toHaveLength(0)
  })
})

const train = {
  timeTableRows: [
    row('HKI', new Date(0), TimeTableRowType.Departure),
    row('LEN', new Date(0), TimeTableRowType.Arrival),
    row('LEN', new Date(0), TimeTableRowType.Departure),
    row('AIN', new Date(0), TimeTableRowType.Arrival),
  ],
  commuterLineid: 'P',
} as const

const noCommuterLineId = { ...train, commuterLineid: null } as const

const [first, airport, last] = (() => {
  return [0, 1, -1].map(i => train.timeTableRows.at(i)?.station.shortCode)
})()

/**
 * # Test helper
 */
function row(
  shortCode: string,
  scheduledTime: Date,
  type: TimeTableRowType,
  commercialTrack?: string,
): RowFragment {
  return {
    station: { shortCode },
    scheduledTime: scheduledTime.toISOString(),
    type,
    commercialTrack: commercialTrack ?? null,
    commercialStop: null,
    cancelled: false,
    liveEstimateTime: null,
  }
}

describe('trains in future', () => {
  const mockTrain = {
    departureDate: '2024-01-01',
    timeTableRows: [
      row(
        'HKI',
        new Date('2024-01-01T12:00:00.000Z'),
        TimeTableRowType.Departure,
      ),
      row(
        'TPE',
        new Date('2024-01-01T13:00:00.000Z'),
        TimeTableRowType.Arrival,
      ),
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

    const result = trainsInFuture(
      [pastTrain],
      'HKI',
      TimeTableRowType.Departure,
    )
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

    const result = trainsInFuture(
      [futureTrain],
      'HKI',
      TimeTableRowType.Departure,
    )
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

    const result = trainsInFuture([train], 'HKI', TimeTableRowType.Departure)
    expect(result).toHaveLength(1)
  })

  it('returns empty array when no matching station is found', () => {
    const result = trainsInFuture(
      [mockTrain],
      'XXX',
      TimeTableRowType.Departure,
    )
    expect(result).toHaveLength(0)
  })

  it('filters by station and type correctly', () => {
    const result = trainsInFuture([mockTrain], 'TPE', TimeTableRowType.Arrival)
    expect(result).toHaveLength(
      mockTrain.timeTableRows[1].scheduledTime > new Date().toISOString()
        ? 1
        : 0,
    )
  })
})
