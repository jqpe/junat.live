import type { Train } from '@junat/digitraffic/types'
import type { Meta, StoryObj } from '@storybook/react'
import type { TimetableProps } from './'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/lib/react_query'

import Timetable from './'

const TRAIN = {
  departureDate: '2022-01-01',
  timeTableRows: [
    {
      stationShortCode: 'HKI',
      scheduledTime: new Date().toISOString(),
      type: 'DEPARTURE'
    }
  ] as Train['timeTableRows'],
  trainNumber: 201,
  trainType: 'HDM'
}

const twoMinutesLate = (() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 2)
  return date.toISOString()
})()

export const Default: StoryObj<TimetableProps> = {
  args: {
    locale: 'fi',
    stationShortCode: 'HKI',
    trains: [
      TRAIN,
      { ...TRAIN, cancelled: true },
      {
        ...TRAIN,
        timeTableRows: [
          { ...TRAIN.timeTableRows[0], liveEstimateTime: twoMinutesLate }
        ]
      }
    ]
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ]
}

export default { component: Timetable } satisfies Meta<TimetableProps>
