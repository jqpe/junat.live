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

it('throws type error if global fetch is not defined', async () => {
  vi.stubGlobal('fetch', undefined)
  expect(() => createHandler(vi.fn())).toThrowError(TypeError)

  vi.stubGlobal('fetch', await import('node-fetch').then(mod => mod.default))
})

it("doesn't throw type error if global fetch is defined", () => {
  expect(() => createHandler(vi.fn())).not.toThrow()
})
