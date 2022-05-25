import { it, expect } from 'vitest'

import { getYyyyMmDd } from '../../src/utils/date'

it('prefixes months and dates with zero if present', () => {
  expect(getYyyyMmDd(new Date(0).toISOString())).toStrictEqual('1970-01-01')
})

it("uses finland's timezone by default", () => {
  expect(
    getYyyyMmDd(new Date('2022-05-25T21:07:00.000Z').toISOString())
  ).toStrictEqual('2022-05-26')
})
