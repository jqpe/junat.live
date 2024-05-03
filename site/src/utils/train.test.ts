import { describe, expect, it } from 'vitest'

import { getFutureTimetableRow, getTrainType } from '@utils/train'
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
      getFutureTimetableRow(stationShortCode, timetableRows)
    ).toStrictEqual(timetableRows.at(1))
  })
})
