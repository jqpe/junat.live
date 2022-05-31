import { getLiveTrains } from '../../src/handlers/live_trains'

import { it, expect } from 'vitest'

import { server } from '../../mocks/server'
import { rest } from 'msw'
import { TrainCategory } from '../../src/types/train_category'

const url =
  'https://rata.digitraffic.fi/api/v1/live-trains/station/:stationShortCode'

it('works without options', async () => {
  const trains = await getLiveTrains('HKI')

  expect(Array.isArray(trains)).toStrictEqual(true)
})

it('throws if station shortcode is not a string', () => {
  expect(() => getLiveTrains(null)).rejects.and.toThrowError(
    /Expected stationShortCode to be a string/
  )
})

it('throws an error if rate limit is achieved', () => {
  server.resetHandlers(
    rest.get(url, (_req, res, ctx) => {
      return res(
        ctx.status(429),
        ctx.text(
          'Too many requests. Only 60 requests per minute per ip per url or 600 requests per minute per ip are allowed'
        )
      )
    })
  )

  expect(async () => await getLiveTrains('HKI')).rejects.and.toThrowError(
    /Request to .* failed with status code 429/
  )
})

// Assumes that the live_trains defined in mocks directory contains a train with stationShortCode KHK that
// has trainStopping = false.
it('includes non-stopping trains if parameter is set', async () => {
  const trains = await getLiveTrains('HKI', { includeNonStopping: true })

  const train = trains.find(train => {
    return train.timeTableRows.find(s => s.stationShortCode === 'KHK')
  })

  const station = train.timeTableRows.find(tr => {
    return tr.stationShortCode === 'KHK'
  })

  expect(station.trainStopping).toStrictEqual(false)
})

// Assumes that the live_trains defined in mocks directory contains a train with stationShortCode KHK that
// has trainStopping = false.
it('includes non-stopping trains if parameter is set', async () => {
  const trains = await getLiveTrains('HKI', { includeNonStopping: true })

  const train = trains.find(train => {
    return train.timeTableRows.find(s => s.stationShortCode === 'KHK')
  })

  const station = train.timeTableRows.find(tr => {
    return tr.stationShortCode === 'KHK'
  })

  expect(station.trainStopping).toStrictEqual(false)
})

it('includes version in parameters if defined', async () => {
  let params: URLSearchParams

  server.resetHandlers(
    rest.get(url, (req, res, ctx) => {
      params = req.url.searchParams
      return res(ctx.status(200), ctx.json([]))
    })
  )

  await getLiveTrains('HKI', { version: 2020 })

  expect(params.get('version')).toStrictEqual('2020')
})

it('includes train categories in parameters if defined', async () => {
  const expectedCategories: TrainCategory[] = [
    'Cargo',
    'Commuter',
    'Locomotive'
  ]
  let categories: URLSearchParams

  server.resetHandlers(
    rest.get(url, (req, res, ctx) => {
      categories = req.url.searchParams
      return res(ctx.status(200), ctx.json([]))
    })
  )

  await getLiveTrains('HKI', {
    categories: expectedCategories
  })

  expect(categories.get('train_categories')).toStrictEqual(
    expectedCategories.join(',')
  )
})
