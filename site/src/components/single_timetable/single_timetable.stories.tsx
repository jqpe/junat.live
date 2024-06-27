import type { Meta } from '@storybook/react'
import type { Station } from '@junat/digitraffic/types'
import type { SingleTimetableProps } from '.'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'

import { SingleTimetable } from '.'

export const Default = {}

const date = (desiredOffsetMins: number) => {
  const minute = 60 * 1000
  return new Date(Date.now() + desiredOffsetMins * minute).toISOString()
}

const TIMETABLE_ROWS = [
  {
    scheduledTime: new Date().toISOString(),
    stationShortCode: 'HKI',
    type: 'DEPARTURE',
    commercialStop: true,
  },
  {
    scheduledTime: date(2),
    stationShortCode: 'JP',
    type: 'DEPARTURE',
    commercialStop: true,
  },
  {
    scheduledTime: date(5),
    liveEstimateTime: date(10),
    stationShortCode: 'AIN',
    type: 'ARRIVAL',
    commercialStop: true,
  },
] as const

export default {
  component: SingleTimetable,
  args: {
    timetableRows: [...TIMETABLE_ROWS],
  },
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          {Story()}
        </QueryClientProvider>
      )
    },
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
          return HttpResponse.json<Partial<Station>[]>([
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Järvenpää asema',
              stationShortCode: 'JP',
            },
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Ainola',
              stationShortCode: 'AIN',
            },
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Helsinki asema',
              stationShortCode: 'HKI',
            },
            {
              countryCode: 'FI',
              latitude: 1,
              longitude: 2,
              stationName: 'Riihimäki asema',
              stationShortCode: 'RI',
            },
          ])
        }),
      ],
    },
    nextjs: {
      router: {
        locale: 'en',
      },
    },
  },
} satisfies Meta<SingleTimetableProps>
