import { fetchLiveTrains } from '../../src/handlers/live_trains'

import { expect, it } from 'vitest'

import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { DigitrafficError } from '../../src/base/classes/digitraffic_error'
import { TrainCategory } from '../../src/types/train_category'

const url =
  'https://rata.digitraffic.fi/api/v1/live-trains/station/:stationShortCode'

it('works without options', async () => {
  const trains = await fetchLiveTrains('HKI')

  expect(Array.isArray(trains)).toStrictEqual(true)
  expect(trains?.length).toBeGreaterThan(0)
})

it('throws if station shortcode is not a string', () => {
  // @ts-expect-error TypeScript should error if stationShortCode is not a string.
  expect(() => fetchLiveTrains(null)).rejects.and.toThrowError(
    /Expected stationShortCode to be a string/
  )
})

it('throws an error if rate limit is achieved', () => {
  server.resetHandlers(
    http.get(url, ({}) => {
      return HttpResponse.text(
        'Too many requests. Only 60 requests per minute per ip per url or 600 requests per minute per ip are allowed',
        { status: 429 }
      )
    })
  )

  expect(() => fetchLiveTrains('HKI')).rejects.and.toThrowError(
    DigitrafficError
  )
})

// Assumes that the live_trains defined in mocks directory contains a train with stationShortCode KHK that
// has trainStopping = false.
it('includes non-stopping trains if parameter is set', async () => {
  const trains = await fetchLiveTrains('HKI', { includeNonStopping: true })

  const train = trains?.find(train => {
    return train.timeTableRows.find(s => s.stationShortCode === 'KHK')
  })

  const station = train?.timeTableRows.find(tr => {
    return tr.stationShortCode === 'KHK'
  })

  expect(station?.trainStopping).toStrictEqual(false)
})

// Assumes that the live_trains defined in mocks directory contains a train with stationShortCode KHK that
// has trainStopping = false.
it('includes non-stopping trains if parameter is set', async () => {
  const trains = await fetchLiveTrains('HKI', { includeNonStopping: true })

  const train = trains?.find(train => {
    return train.timeTableRows.find(s => s.stationShortCode === 'KHK')
  })

  const station = train?.timeTableRows.find(tr => {
    return tr.stationShortCode === 'KHK'
  })

  expect(station?.trainStopping).toStrictEqual(false)
})

it.each(['arriving', 'arrived', 'departed'])(
  'defaults all other parameters to zero when only %s is defined',
  async type => {
    let params: URLSearchParams

    server.resetHandlers(
      http.get(url, ({ request }) => {
        params = new URL(request.url).searchParams
        return HttpResponse.json([])
      })
    )

    await fetchLiveTrains('HKI', { [type]: 20 }).then(() => {
      const typeRe = new RegExp(type)

      for (const param of [
        'departed_trains',
        'departing_trains',
        'arriving_trains',
        'arrived_trains'
      ]) {
        if (typeRe.test(param)) {
          expect(params.get(`${type}_trains`)).toStrictEqual('20')
          continue
        }

        expect(params.get(param)).toStrictEqual('0')
      }
    })
  }
)

it('defaults to 20 departing trains if options is unset', async () => {
  let params: URLSearchParams

  server.resetHandlers(
    http.get(url, ({ request }) => {
      params = new URL(request.url).searchParams
      return HttpResponse.json([])
    })
  )

  await fetchLiveTrains('HKI').then(() => {
    expect(params.get('departing_trains')).toStrictEqual('20')
  })
})

it('includes version in parameters if defined', async () => {
  let params: URLSearchParams

  server.resetHandlers(
    http.get(url, ({ request }) => {
      params = new URL(request.url).searchParams
      return HttpResponse.json([])
    })
  )

  await fetchLiveTrains('HKI', { version: 2020 }).then(() => {
    expect(params.get('version')).toStrictEqual('2020')
  })
})

it('includes train categories in parameters if defined', async () => {
  const expectedCategories: TrainCategory[] = [
    'Cargo',
    'Commuter',
    'Locomotive'
  ]
  let categories: URLSearchParams

  server.resetHandlers(
    http.get(url, ({ request }) => {
      categories = new URL(request.url).searchParams
      return HttpResponse.json([])
    })
  )

  await fetchLiveTrains('HKI', {
    categories: expectedCategories
  }).then(() => {
    expect(categories.get('train_categories')).toStrictEqual(
      expectedCategories.join(',')
    )
  })
})
