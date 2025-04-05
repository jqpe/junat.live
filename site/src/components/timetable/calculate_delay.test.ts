import { expect, it } from 'vitest'

import { animation } from './index'

it('returns 0..19 for the first group', () => {
  expect(animation(0).transition.delay).toBe(0)
  expect(animation(19).transition.delay).toBe(19)
})

it('returns 0..79 for the second group', () => {
  expect(animation(20).transition.delay).toBe(0)
  expect(animation(99).transition.delay).toBe(79)
})

it('returns 0..100 for the third group and subsequent groups', () => {
  expect(animation(100).transition.delay).toBe(0)
  expect(animation(199).transition.delay).toBe(99)

  expect(animation(200).transition.delay).toBe(0)
  expect(animation(299).transition.delay).toBe(99)
})
