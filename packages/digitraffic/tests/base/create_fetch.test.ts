import { it, expect, vi } from 'vitest'
import { createFetch } from '../../src/base/create_fetch'

import { server } from '../../mocks/server'
import { rest, RestRequest } from 'msw'

const AbortController =
  globalThis.AbortController ||
  (await import('abort-controller').then(m => m.AbortController))

it("throws if path doesn't start with a slash /", () => {
  expect(async () => await createFetch('')).rejects.and.toThrow(TypeError)
})

it('returns a json response by default', async () => {
  expect(await createFetch('/metadata/stations')).toBeInstanceOf(Array)
})

it('returns undefined without fetching if signal is aborted before fetching', async () => {
  const controller = new AbortController()

  controller.abort()

  expect(controller.signal.aborted).toBe(true)
  expect(await createFetch('/', { signal: controller.signal })).toBe(undefined)
})

it('can abort while fetching', async () => {
  const controller = new AbortController()
  const fetch = vi.fn().mockImplementation(createFetch)

  let request: RestRequest

  server.use(
    rest.get(`https://rata.digitraffic.fi/api/v1/`, async (req, res) => {
      request = req

      return res(
        await new Promise(resolve =>
          setTimeout(resolve, new Date(0).setMinutes(10))
        )
      )
    })
  )

  await Promise.race([fetch('/'), Promise.resolve(controller.abort())])

  expect(request).toBeDefined()
  expect(fetch).toHaveBeenCalled()
})

it("throws an error if json couldn't be parsed", () => {
  server.resetHandlers(
    rest.get(
      'https://rata.digitraffic.fi/api/v1/metadata/stations',
      (_, res, ctx) => {
        return res(ctx.text('Too many requests.'))
      }
    )
  )

  expect(
    async () => await createFetch('/metadata/stations')
  ).rejects.and.toThrow(SyntaxError)
})
