import { it, expect, describe } from 'vitest'
import { getDepartureDate } from '~/features/pages/single_train/helpers'

describe('getDepartureDate', () => {
  it('Prefers user defined value if supplied (JUN-186)', () => {
    const userProvided = new Date().toISOString()
    const departureDate = getDepartureDate({
      userProvided,
      default: 'do not use'
    })

    expect(departureDate).toStrictEqual(userProvided)
  })
})
