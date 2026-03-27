import type { Meta, StoryObj } from '@storybook/nextjs'
import type { LiveTrainFragment, RowFragment } from '@junat/graphql/digitraffic'
import type { TimetableProps } from './'

import { TimeTableRowType } from '@junat/graphql/digitraffic'

import Timetable from './'

const now = new Date()
const nowIsoCalendar = now.toISOString().split('T')[0]!

const TRAIN = {
  departureDate: nowIsoCalendar,
  timeTableRows: [
    {
      station: { shortCode: 'HKI' },
      scheduledTime: new Date().toISOString(),
      type: TimeTableRowType.Departure,
      cancelled: false,
      commercialStop: null,
      commercialTrack: null,
      liveEstimateTime: null,
      actualTime: null,
    } satisfies RowFragment,
  ],
  trainNumber: 201,
  trainType: { name: 'HDM' },
  commuterLineid: null,
  version: '',
  cancelled: false,
} satisfies LiveTrainFragment

const twoMinutesLate = (() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 2)
  return date.toISOString()
})()

export const Default: StoryObj<TimetableProps> = {
  args: {
    stationShortCode: 'HKI',
    trains: [
      TRAIN,
      { ...TRAIN, cancelled: true },
      {
        ...TRAIN,
        timeTableRows: [
          {
            ...TRAIN.timeTableRows[0],
            liveEstimateTime: twoMinutesLate,
          } as RowFragment,
        ],
      },
    ],
  },
}

export default { component: Timetable } satisfies Meta<TimetableProps>
