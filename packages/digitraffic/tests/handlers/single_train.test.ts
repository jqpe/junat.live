import { fetchSingleTrain } from '../../src/handlers/single_train'

import { expect, it } from 'vitest'
import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'

it('works with train number', async () => {
  const train = await fetchSingleTrain({ trainNumber: 1 })

  expect(train?.trainNumber).toStrictEqual(1)
})

it('might return undefied if digitraffic responds with empty array', async () => {
  const train = await fetchSingleTrain({ trainNumber: 2 })

  expect(train).toBeUndefined()
})

it('throws if train number is not a number', async () => {
  // @ts-expect-error TypeScript should error if trainNumber is not a number.
  const fn = async () => await fetchSingleTrain({ trainNumber: null })

  expect(fn).rejects.and.toThrow(/Expected train number to be a number/)
})

it('throws if version is not a number or a string', async () => {
  const fn = async () =>
    // @ts-expect-error TypeScript should error if version is not a number or string.
    await fetchSingleTrain({ trainNumber: 1, version: null })

  expect(fn).rejects.and.toThrow(/Expected version to be a number or a string/)
})

it('throws if date is not in iso 8601', async () => {
  const fn = async () => await fetchSingleTrain({ trainNumber: 1, date: 'x' })

  expect(fn).rejects.and.toThrow(/Date didn't match RegExp/)
})

it('includes version if defined', async () => {
  let params: URLSearchParams

  server.use(
    http.get(
      'https://rata.digitraffic.fi/api/v1/trains/:date/:trainNumber',
      ({ request }) => {
        params = new URL(request.url).searchParams
        return HttpResponse.json([])
      }
    )
  )

  await fetchSingleTrain({ trainNumber: 1, version: 0 }).then(() => {
    expect(params.get('version')).toStrictEqual('0')
  })
})
