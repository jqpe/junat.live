import { rest } from 'msw'
import { expect, it } from 'vitest'
import { server } from '../../../mocks/server'

import { fetchStations } from '../../../src/handlers/stations'
import { DigitrafficError } from '../../../src/base/classes/digitraffic_error'

it('has expected properties on non 2xx response codes', async () => {
  server.resetHandlers(
    rest.get(
      'https://rata.digitraffic.fi/api/v1/metadata/stations',
      (_req, res, ctx) => res(ctx.status(400), ctx.text('Invalid request.'))
    )
  )

  const error: DigitrafficError = await fetchStations().catch(e => e)

  expect(DigitrafficError.name).toEqual('DigitrafficError')

  expect(error).toBeInstanceOf(DigitrafficError)
  expect(error.toString()).toStrictEqual(
    'DigitrafficError: Request to /metadata/stations failed with status code 400'
  )

  expect(Object.keys(error)).to.have.members([
    'body',
    'path',
    'status',
    'statusText',
    'type',
    'name',
    'message',
    'query'
  ])

  expect(error.url).toStrictEqual("https://rata.digitraffic.fi/api/v1/metadata/stations")
  expect(error.body).toStrictEqual('Invalid request.')
  expect(error.path).toStrictEqual('/metadata/stations')
  expect(error.status).toStrictEqual(400)
  expect(error.statusText).toStrictEqual('Bad Request')
  expect(error.type).toStrictEqual('default')
})

it('handles network errors', async () => {
  server.resetHandlers(
    rest.get(
      'https://rata.digitraffic.fi/api/v1/metadata/stations',
      (_req, res) => res.networkError('Failed to connect')
    )
  )

  const error: DigitrafficError = await fetchStations().catch(e => e)

  expect(error).toBeInstanceOf(Error)
  expect(error.path).toBe('/metadata/stations')
  expect(error.statusText).toBe('')
  expect(error.body).toBe(null)
  expect(error.status).toBe(0)
  expect(error.type).toBe('error')
  expect(error.isNetworkError).toBe(true)
})
