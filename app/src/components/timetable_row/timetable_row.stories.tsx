import type { Meta, StoryObj } from '@storybook/react'
import type { GetTranslatedValue } from '@junat/core/i18n'
import type { Train } from '@junat/digitraffic/types'
import type { TimetableRowProps } from '.'
import type { Locale } from '~/types/common'

import { getRouter } from '@storybook/nextjs/router.mock'
import { expect, userEvent, within } from '@storybook/test'

import { getTrainHref } from '@junat/core/utils/train'

import { translate } from '~/i18n'
import { TIMETABLE_ROW_TEST_ID, TimetableRow } from '.'

const TRAIN = {
  departureDate: '2022-01-01',
  timeTableRows: [
    {
      stationShortCode: 'HKI',
      scheduledTime: new Date(Date.now() * 1.5).toISOString(),
      type: 'DEPARTURE',
    },
  ] as Train['timeTableRows'],
  trainNumber: 201,
  trainType: 'HDM',
}

export const Default: StoryObj<TimetableRowProps> = {
  args: {
    type: 'DEPARTURE',
    locale: 'fi',
    train: TRAIN,
    lastStationId: '',
    stations: [
      {
        stationName: {
          en: 'Helsinki',
          sv: 'Helsingfors',
          fi: 'Helsinki',
        } as Record<Locale, string>,
        countryCode: 'FI',
        latitude: 0,
        longitude: 1,
        stationShortCode: 'HKI',
      },
    ],
    stationShortCode: 'HKI',
    cancelledText: translate('en')('cancelled'),
  },
  argTypes: {
    animation: {
      table: {
        disable: true,
      },
    },
  },
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
