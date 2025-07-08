import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { stations } from './stations'

export const server = setupServer(
  http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
    return HttpResponse.json(stations)
  }),
)
