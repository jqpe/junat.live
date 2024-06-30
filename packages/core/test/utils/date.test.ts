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

  it('formats time correctly in hh.mm format', () => {
    expect(getFormattedTime('2023-05-15T14:30:00Z')).toBe('14.30')
  })

  it('handles midnight correctly', () => {
    expect(getFormattedTime('2023-05-15T00:00:00Z')).toBe('00.00')
  })

  it('handles time close to midnight', () => {
    expect(getFormattedTime('2023-05-15T23:59:59Z')).toBe('23.59')
  })

  it('handles date strings without time (assumes midnight)', () => {
    expect(getFormattedTime(EXPECTED)).toBe('00.00')
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
