import { it, expect, describe } from 'vitest'
import { getDepartureDate } from '~/features/pages/single_train/helpers'

describe('getDepartureDate', () => {
  it('Prefers user defined value if supplied (JUN-186)', () => {
    const date = new Date()
    const departureDate = getDepartureDate({
      userProvided: date.toISOString(),
      default: 'do not use'
    })
    expect(departureDate).toStrictEqual(date.toISOString())
  })
})
