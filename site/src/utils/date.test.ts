import { it, expect, describe } from 'vitest'

import { getCalendarDate, getFormattedTime } from '@utils/date'

describe('format train time', () => {
  it('throws on invalid date', () => {
    expect(() => getFormattedTime('invalid')).toThrow('Invalid time value')
  })

  it('returns date in hh.mm format on valid date', () => {
    expect(getFormattedTime('2022-12-12')).toMatch(/\d{2}.\d{2}/)
  })
})

describe('get calendar date', () => {
  it('prefixes months and dates with zero if present', () => {
    expect(getCalendarDate(new Date(0).toISOString())).toStrictEqual(
      '1970-01-01'
    )
  })
})
