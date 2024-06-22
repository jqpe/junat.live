import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { setupServer } from 'msw/node'

export const server = setupServer()

beforeAll(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  vi.resetAllMocks()
  server.close()
})

afterEach(() => server.resetHandlers())
