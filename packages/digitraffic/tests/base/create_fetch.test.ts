import { expect, it, vi } from 'vitest'
import { createFetch } from '../../src/base/create_fetch'

import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'

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

  server.use(
    http.get(`https://rata.digitraffic.fi/api/v1/`, async () => {
      return HttpResponse.text(
        await new Promise(resolve =>
          setTimeout(resolve, new Date(0).setMinutes(10))
        )
      )
    })
  )

  await Promise.race([fetch('/'), Promise.resolve(controller.abort())]).then(
    () => {
      expect(fetch).toHaveBeenCalled()
    }
  )
})

// All responses in range 200-299 should be JSON.
// If the request is malformed Digitraffic returns a correct status code and `DigitrafficError` handles it instead.
it("throws an error if json couldn't be parsed", () => {
  server.use(
    http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
      return HttpResponse.text('Too many requests.')
    })
  )

  expect(() => createFetch('/metadata/stations')).rejects.and.toThrow(
    SyntaxError
  )
})
