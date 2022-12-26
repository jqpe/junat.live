import { isDateFormer, getFormattedDate, whenDateIsFormer } from '../helpers'

import { it, expect, describe } from 'vitest'
import exp from 'constants'

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

describe('when date is former', () => {
  function futureDate() {
    const second = 1000 as const
    const tenMinutes = second * 600

    return `${new Date(new Date().getTime() + tenMinutes)}`
  }

  it('returns the value in `returns` when date is in the past', () => {
    const former = `${new Date()}`

    const result = whenDateIsFormer(former, {
      returns: 1,
      otherwiseIfDefined: 0
    })

    expect(result).toStrictEqual(1)
  })

  it('returns the value in `otherwiseIfDefined` if date is in the present or future', () => {
    const result = whenDateIsFormer(futureDate(), {
      returns: 1,
      otherwiseIfDefined: 0
    })

    expect(result).toStrictEqual(0)
  })

  it('returns the value in `returns` if `otherwiseIfDefined` is undefined', () => {
    const result = whenDateIsFormer(futureDate(), {
      returns: 1,
      otherwiseIfDefined: undefined
    })

    expect(result).toStrictEqual(1)
  })
})
