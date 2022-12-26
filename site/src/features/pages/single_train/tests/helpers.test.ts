import { isDateFormer, getFormattedDate } from '../helpers'

import { it, expect, describe } from 'vitest'

describe('get formatted date', () => {
  it("doesn't throw on an invalid time", () => {
    expect(() => getFormattedDate('test')).not.toThrow()
  })
})

describe('is date former', () => {
  it('returns true if date is in past', () => {
    const now = new Date().toString()

    expect(isDateFormer(now)).toStrictEqual(true)
  })

  it("doesn't throw on invalid time", () => {
    expect(() => isDateFormer('test')).not.toThrow()
  })

  it("accepts 'latest' as a parameter", () => {
    expect(isDateFormer('latest')).toStrictEqual(false)
  })
})
