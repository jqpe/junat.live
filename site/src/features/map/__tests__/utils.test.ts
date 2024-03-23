import { getGtfsid } from '../utils'
import { it, expect } from 'vitest'

it('returns a valid gtfsid for trains operated by VR', () => {
  expect(
    getGtfsid({
      arrivalShortCode: 'JPA',
      departureShortCode: 'HKI',
      operatorShortCode: 'vr',
      trainCategory: 'Commuter',
      trainNumber: 1003,
      commuterLineId: 'R'
    })
  ).toStrictEqual('digitraffic:HKI_JPA_R_109_10')
})

it('returns a valid gtfsid for trains operated by HSL', () => {
  expect(
    getGtfsid({
      arrivalShortCode: 'JPA',
      departureShortCode: 'HKI',
      operatorShortCode: 'hsl',
      trainCategory: 'Long-distance',
      trainNumber: 2003,
      commuterLineId: 'P'
    })
  ).toStrictEqual('hsl:HKI_JPA_P_102_10')
})
