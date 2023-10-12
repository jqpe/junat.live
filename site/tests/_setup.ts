import { afterEach, afterAll, beforeAll, vi } from 'vitest'

import { setupServer } from 'msw/node'
import { digitrafficApiStatusSummary } from './__data__/handlers'

export const server = setupServer(digitrafficApiStatusSummary)

beforeAll(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  vi.resetAllMocks()
  server.close()
})

afterEach(() => server.resetHandlers())
