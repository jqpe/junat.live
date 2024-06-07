import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { liveTrains } from './live_trains'
import { train1 } from './single_train'
import { stations } from './stations'

export const server = setupServer(
  http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
    return HttpResponse.json(stations)
  }),
  http.get(
    'https://rata.digitraffic.fi/api/v1/live-trains/station/:stationShortCode',
    () => {
      return HttpResponse.json(liveTrains)
    }
  ),
  http.get(
    'https://rata.digitraffic.fi/api/v1/trains/:date/:trainNumber',
    ({ request }) => {
      const tn = new URL(request.url).searchParams.get('trainNumber')
      if (typeof tn === 'string' && tn === '1') {
        return HttpResponse.json([train1])
      }

      if (typeof tn === 'string' && tn === '2') {
        return HttpResponse.json([])
      }
    }
  )
)
