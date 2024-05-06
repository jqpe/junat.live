import { describe, expect, it } from 'vitest'

import { getFutureTimetableRow, getTrainType, sortTrains } from '@utils/train'
import { LOCALES } from '../../src/constants/locales'
import translate from './translate'

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
      getFutureTimetableRow(stationShortCode, timetableRows, type)
    ).toStrictEqual(timetableRows.at(1))
  })
})

describe('sort trains', () => {
  it.each([
    { type: 'DEPARTURE', msg: 'sorts trains by DEPARTURE' },
    { type: 'ARRIVAL', msg: 'sorts trains by ARRIVAL' }
  ] as const)('$msg', ({ type }) => {
    const trains = [
      {
        timeTableRows: [
          {
            scheduledTime: new Date(Date.now() * 1.1).toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE'
          }
        ]
      },
      {
        timeTableRows: [
          {
            scheduledTime: new Date().toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE'
          }
        ]
      },
      {
        timeTableRows: [
          {
            scheduledTime: new Date(Date.now() * 1.1).toISOString(),
            stationShortCode: 'HKI',
            type: 'ARRIVAL'
          }
        ]
      },
      {
        timeTableRows: [
          {
            scheduledTime: new Date().toISOString(),
            stationShortCode: 'HKI',
            type: 'ARRIVAL'
          }
        ]
      }
    ] as const

    if (type === 'ARRIVAL') {
      expect(sortTrains(trains, 'HKI', type)).toStrictEqual([
        // Only sorts the trains where type === ARRIVAL, thus the first two elements stay unsorted.
        trains[0],
        trains[1],

        trains[3],
        trains[2]
      ])
    } else {
      expect(sortTrains(trains, 'HKI', type)).toStrictEqual([
        trains[1],
        trains[0],

        // Only sorts the trains where type === DEPARTURE, thus the last two elements stay unsorted.
        trains[2],
        trains[3]
      ])
    }
  })

  it('does not modify the original array', () => {
    const trains = [
      {
        timeTableRows: [
          {
            scheduledTime: new Date(Date.now() * 1.1).toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE'
          }
        ]
      },
      {
        timeTableRows: [
          {
            scheduledTime: new Date().toISOString(),
            stationShortCode: 'HKI',
            type: 'DEPARTURE'
          }
        ]
      }
    ] as const

    const trainsCopy = structuredClone(trains)

    sortTrains(trains, 'HKI', 'DEPARTURE')

    expect(trains).toStrictEqual(trainsCopy)
  })
})
