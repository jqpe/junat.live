import { it, expect, vi } from 'vitest'

import { createHandler } from '../../src/base/create_handler'

it('returns the function passed to it', async () => {
  const fn = () => {}
  expect(createHandler(fn)).toBe(fn)
})

it("doesn't call the function passed to it", async () => {
  const fn = vi.fn()
  expect(createHandler(fn)).toBe(fn)
  expect(fn).toBeCalledTimes(0)
})
