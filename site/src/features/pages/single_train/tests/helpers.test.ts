import { getFormattedDate } from '../helpers'

import { it, expect } from 'vitest'

it("doesn't throw on an invalid time", () => {
  expect(() => getFormattedDate('test')).not.toThrow()
})
