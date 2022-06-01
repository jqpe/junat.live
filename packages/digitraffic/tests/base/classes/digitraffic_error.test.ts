import { rest } from 'msw'
import { expect, it } from 'vitest'
import { server } from '../../../mocks/server'

import { fetchStations } from '../../../src/handlers/stations'
import { DigitrafficError } from '../../../src/base/classes/digitraffic_error'

it('works', async () => {
  server.resetHandlers(
    rest.get(
      'https://rata.digitraffic.fi/api/v1/metadata/stations',
      (_req, res, ctx) => res(ctx.status(400), ctx.text('Invalid request.'))
    )
  )

  const error: DigitrafficError = await fetchStations().catch(_ => _)

  expect(error).toBeInstanceOf(DigitrafficError)

  expect(Object.keys(error)).to.have.members([
    'body',
    'path',
    'status',
    'statusText',
    'type'
  ])
  expect(error.body).toStrictEqual('Invalid request.')
  expect(error.path).toStrictEqual('/metadata/stations')
  expect(error.status).toStrictEqual(400)
  expect(error.statusText).toStrictEqual('Bad Request')
  expect(error.type).toStrictEqual('default')
})
