import { it, expect } from 'vitest'

import { getYyyyMmDd } from '../../src/utils/date'

it('prefixes months and dates with zero if present', () => {
  expect(getYyyyMmDd(new Date(0).toISOString())).toStrictEqual('1970-01-01')
})
