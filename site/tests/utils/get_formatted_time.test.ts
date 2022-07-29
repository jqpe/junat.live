import { describe, it, expect } from 'vitest'

import { getFormattedTime } from '../../src/utils/get_formatted_time'

describe('format train time', () => {
  it('throws on invalid date', () => {
    expect(() => getFormattedTime('invalid')).toThrow('Invalid time value')
  })

  it('returns date in hh.mm format on valid date', () => {
    expect(getFormattedTime('2022-12-12')).toMatch(/\d{2}.\d{2}/)
  })
})
