import type { LiveTrainFragment } from '@junat/graphql/digitraffic'
import type { Meta, StoryObj } from '@storybook/react'
import type { TimetableRowProps } from '.'


import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { TimetableRow } from '.'

const TRAIN = {
  departureDate: '2022-01-01',
  timeTableRows: [
    {
      cancelled: false,
      scheduledTime: new Date().toString(),
      station: { shortCode: 'HKI' },
      type: TimeTableRowType.Departure,
      commercialTrack: '1',
      commercialStop: null,
      liveEstimateTime: null,
      actualTime: null,
    },
  ] as const satisfies Array<TimetableRowProps['row']>,
  trainNumber: 201,
  trainType: { name: 'HDM' },
  commuterLineid: null,
  version: '',
  cancelled: false,
} satisfies LiveTrainFragment

export const Default: StoryObj<TimetableRowProps> = {
  args: {
    train: TRAIN,
    row: TRAIN.timeTableRows[0]!,
    stationShortCode: 'HKI',
  } as const satisfies TimetableRowProps,
}
export const Cancelled: StoryObj<TimetableRowProps> = {
  ...Default,
  args: { ...Default.args, train: { ...TRAIN, cancelled: true } },
}

export const PreviousStation = {
  ...Default,
  args: {
    ...Default.args,
    lastStationId: `${TRAIN.timeTableRows[0]?.scheduledTime}-${TRAIN.trainNumber}`,
  },
}

export default { component: TimetableRow } satisfies Meta<TimetableRowProps>
