import { beforeAll, afterEach, afterAll } from 'vitest'

import { server } from '../mocks/server'

import fetch from 'node-fetch'

// see https://github.com/mswjs/interceptors/issues/246

//@ts-expect-error Incompatible types
globalThis.fetch = fetch

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
