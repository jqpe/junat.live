import { expect, it } from 'vitest'

import { calculateDelay } from './index'

it('returns 0..19 for the first group', () => {
  expect(calculateDelay(0)).toBe(0)
  expect(calculateDelay(19)).toBe(19)
})

it('returns 0..79 for the second group', () => {
  expect(calculateDelay(20)).toBe(0)
  expect(calculateDelay(99)).toBe(79)
})

it('returns 0..100 for the third group and subsequent groups', () => {
  expect(calculateDelay(100)).toBe(0)
  expect(calculateDelay(199)).toBe(99)

  expect(calculateDelay(200)).toBe(0)
  expect(calculateDelay(299)).toBe(99)
})
