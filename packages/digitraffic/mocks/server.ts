import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { liveTrains } from './live_trains'
import { train1 } from './single_train'
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
  ),
  rest.get(
    'https://rata.digitraffic.fi/api/v1/trains/:date/:trainNumber',
    (req, res, ctx) => {
      const tn = req.params.trainNumber
      if (typeof tn === 'string' && tn === '1') {
        return res(ctx.status(200), ctx.json([train1]))
      }

      if (typeof tn === 'string' && tn === '2') {
        return res(ctx.status(200), ctx.json([]))
      }
    }
  )
)
