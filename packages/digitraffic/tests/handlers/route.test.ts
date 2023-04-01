import { route } from '../../src/handlers/route'
import { train1 } from '../../mocks/single_train'

import { it, expect } from 'vitest'
import { server } from '../../mocks/server'
import { rest } from 'msw'

it('returns trains', async () => {
  const trains = await route('HKI', 'AIN')

  expect(trains![0]).toStrictEqual(train1)
})

it('throws if departure date is not in yyyy-mm-dd format', async () => {
  const promise = route('HKI', 'AIN', { departureDate: 'invalid format' })

  expect(promise).rejects.and.toThrowError(/yyyy-mm-dd/)
})

it('throws if departure- and arrival stations are not defined', async () => {
  // @ts-expect-error Missing arrival station
  let promise = route('HKI')
  expect(promise).rejects.and.toThrow()

  // @ts-expect-error Missing departure station
  promise = route(undefined, 'AIN')
  expect(promise).rejects.and.toThrow()

  // @ts-expect-error Missing both departure- and arrival stations
  promise = route()
  expect(promise).rejects.and.toThrow()
})

it('throws if options.limit is a negative integer', () => {
  const promise = route('HKI', 'AIN', { limit: -1 })
  expect(promise).rejects.and.toThrow()
})

it('throws if options.limit is a floating point number', () => {
  const promise = route('HKI', 'AIN', { limit: 0.5 })
  expect(promise).rejects.and.toThrow()
})

it('uses snake case for departure date and includeNonstopping', async () => {
  const departureDate = '2022-01-01'
  const includeNonstopping = true

  server.resetHandlers(
    rest.get(
      'https://rata.digitraffic.fi/api/v1/live-trains/station/:departureStation/:arrivalStation',
      (req, res, ctx) => {
        expect(req.url.searchParams.get('departure_date')).toStrictEqual(
          departureDate
        )
        expect(req.url.searchParams.get('include_nonstopping')).toBe(
          String(includeNonstopping)
        )

        return res(ctx.status(200), ctx.json([]))
      }
    )
  )

  await route('HKI', 'AIN', {
    departureDate,
    includeNonstopping
  })
})
