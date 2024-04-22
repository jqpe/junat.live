import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { setupServer } from 'msw/node'

import { http, HttpResponse } from 'msw'

const digitrafficApiStatusSummary = http.get(
  'https://status.digitraffic.fi/api/v2/summary.json',
  () => {
    return HttpResponse.json({
      components: [
        {
          id: 'nfys4zwym2wz',
          name: 'Rail MQTT',
          status: 'operational'
        },
        {
          id: '9vty2wtf2tdz',
          name: '/api/v1/metadata/stations',
          status: 'operational'
        },
        {
          id: '2m8xs6g8chhd',
          name: 'Rail GraphQL',
          status: 'operational'
        }
      ]
    })
  }
)

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
