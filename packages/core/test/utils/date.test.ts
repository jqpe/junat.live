import { afterEach, beforeEach } from 'node:test'

import { getCalendarDate, getFormattedTime } from '#utils/date.js'
import { describe, expect, it, vi } from 'vitest'

const EXPECTED = '2023-05-15' as const

describe('getFormattedTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('may throw on invalid date', () => {
    expect(() => getFormattedTime('invalid')).toThrow('Invalid time value')
  })

  it('formats date', () => {
    expect(getFormattedTime('2024-07-03T02:36:51.338Z')).toStrictEqual('05.36')
  })
})

describe('getCalendarDate', () => {
  it('prefixes months and dates with zero if present', () => {
    expect(getCalendarDate(new Date(0).toISOString())).toStrictEqual(
      '1970-01-01',
    )
  })

  it('returns the correct calendar date in ISO 8601 format', () => {
    expect(getCalendarDate('2023-05-15T12:30:00Z')).toBe(EXPECTED)
  })

  it('handles date strings without time', () => {
    expect(getCalendarDate('2023-05-15')).toBe(EXPECTED)
  })

  it('handles date objects', () => {
    const date = new Date('2023-05-15T12:30:00Z')
    expect(getCalendarDate(date.toISOString())).toBe(EXPECTED)
  })
})
