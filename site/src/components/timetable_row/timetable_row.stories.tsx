import type { Meta, StoryObj } from '@storybook/react'
import type { GetTranslatedValue } from '@junat/core/i18n'
import type { LiveTrainFragment } from '@junat/graphql/digitraffic'
import type { TimetableRowProps } from '.'

import { getRouter } from '@storybook/nextjs/router.mock'
import { expect, fireEvent, userEvent, within } from '@storybook/test'

import { getTrainHref } from '@junat/core/utils/train'
import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { TIMETABLE_ROW_TEST_ID, TimetableRow } from '.'

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

export default {
  component: TimetableRow,
  play: async context => {
    const canvas = within(context.canvasElement)
    const row = await canvas.findByTestId(TIMETABLE_ROW_TEST_ID)

    // Clicking timetable row should push a new route
    // and set the last station id
    {
      await userEvent.click(row)
      await expect(getRouter().push).toHaveBeenCalledOnce()

      await expect(getRouter().push).toHaveBeenCalledWith(
        getTrainHref(
          (() => 'juna') as GetTranslatedValue,
          TRAIN.departureDate,
          TRAIN.trainNumber,
        ),
      )
    }

    // Enter key should push a new route
    {
      await fireEvent.keyDown(row, { key: 'Enter' })
      await expect(getRouter().push).toHaveBeenCalledTimes(2)
    }

    // Space key should push a new route
    {
      await fireEvent.keyDown(row, { key: '\u0020' })
      await expect(getRouter().push).toHaveBeenCalledTimes(3)
    }

    // Other keys should not push a new route
    {
      const keys = ['ArrowDown', 'ArrowUp', 'Escape']

      await Promise.all(keys.map(key => fireEvent.keyDown(row, { key: key })))
      await expect(getRouter().push).toHaveBeenCalledTimes(3)
    }
  },
} satisfies Meta<TimetableRowProps>
