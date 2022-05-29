import { it, expect } from 'vitest'

import { getCalendarDate } from '@utils/date'

it('prefixes months and dates with zero if present', () => {
  expect(getCalendarDate(new Date(0).toISOString())).toStrictEqual('1970-01-01')
})
