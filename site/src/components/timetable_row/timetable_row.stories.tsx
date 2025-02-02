import type { Meta, StoryObj } from '@storybook/react'
import type { GetTranslatedValue } from '@junat/core/i18n'
import type { TimetableRowProps } from '.'

import { getRouter } from '@storybook/nextjs/router.mock'
import { expect, userEvent, within } from '@storybook/test'

import { getTrainHref } from '@junat/core/utils/train'

import { TIMETABLE_ROW_TEST_ID, TimetableRow } from '.'

const TRAIN = {
  departureDate: '2022-01-01',
  timeTableRows: [
    {
      cancelled: false,
      causes: [],
      countryCode: 'FI',
      scheduledTime: new Date().toString(),
      stationShortCode: 'HKI',
      stationUICCode: 0,
      trainStopping: true,
      type: 'DEPARTURE',
      commercialTrack: '1',
    },
  ] as const satisfies Array<TimetableRowProps['row']>,
  trainNumber: 201,
  trainType: 'HDM',
}

export const Default: StoryObj<TimetableRowProps> = {
  args: {
    train: TRAIN,
    fadeIn: { opacity: 1 },
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

      await expect(getRouter().push).toHaveBeenCalledWith(
        getTrainHref(
          (() => 'juna') as GetTranslatedValue,
          TRAIN.departureDate,
          TRAIN.trainNumber,
        ),
      )
    }
  },
} satisfies Meta<TimetableRowProps>
