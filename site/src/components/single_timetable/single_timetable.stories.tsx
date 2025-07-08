import type { Meta } from '@storybook/react'
import type { Station } from '@junat/digitraffic/types'
import type { RowFragment } from '@junat/graphql/digitraffic'
import type { SingleTimetableProps } from '.'

import { http, HttpResponse } from 'msw'

import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { SingleTimetable } from '.'

export const Default = {}

const date = (desiredOffsetMins: number) => {
  const minute = 60 * 1000
  return new Date(Date.now() + desiredOffsetMins * minute).toISOString()
}

const row = <T extends Pick<RowFragment, 'scheduledTime' | 'type'>>(
  requiredFields: T & {
    shortCode: string
  },
): RowFragment => ({
  ...requiredFields,
  station: { shortCode: requiredFields.shortCode },
  commercialTrack: null,
  commercialStop: true,
  cancelled: false,
  liveEstimateTime: null,
})

const TIMETABLE_ROWS = [
  row({
    scheduledTime: new Date().toISOString(),
    shortCode: 'HKI',
    type: TimeTableRowType.Departure,
  }),
  row({
    scheduledTime: date(2),
    shortCode: 'JP',
    type: TimeTableRowType.Departure,
  }),
  row({
    scheduledTime: date(2),
    shortCode: 'JP',
    type: TimeTableRowType.Departure,
  }),
  row({
    scheduledTime: date(5),
    liveEstimateTime: date(10),
    shortCode: 'AIN',
    type: TimeTableRowType.Arrival,
  }),
] as const

export default {
  component: SingleTimetable,
  args: {
    timetableRows: [...TIMETABLE_ROWS],
  },
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
