import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { liveTrains } from './live_trains'
import { stations } from './stations'

export const server = setupServer(
  rest.get(
    'https://rata.digitraffic.fi/api/v1/metadata/stations',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(stations))
    }
  ),
  rest.get(
    'https://rata.digitraffic.fi/api/v1/live-trains/station/:stationShortCode',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(liveTrains))
    }
  )
)
