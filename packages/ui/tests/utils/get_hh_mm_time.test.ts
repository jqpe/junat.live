import { describe, it, expect } from 'vitest'

import { getHhMmTime } from '../../utils/get_hh_mm_time'

describe('format train time', () => {
  it('throws on invalid date', () => {
    expect(() => getHhMmTime('invalid')).toThrow('Invalid time value')
  })

  it('returns date in hh.mm format on valid date', () => {
    expect(getHhMmTime('2022-12-12')).toMatch(/\d{2}.\d{2}/)
  })
})
