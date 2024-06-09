import type { Meta, StoryObj } from '@storybook/react'
import type { TimetableRowProps } from '.'
import type { Train } from '@junat/digitraffic/types'

import translate from '~/utils/translate'
import { TimetableRow } from '.'

const TRAIN = {
  departureDate: '2022-01-01',
  timeTableRows: [
    {
      stationShortCode: 'HKI',
      scheduledTime: new Date(Date.now() * 1.5).toISOString(),
      type: 'DEPARTURE'
    }
  ] as Train['timeTableRows'],
  trainNumber: 201,
  trainType: 'HDM'
}

export const Default: StoryObj<TimetableRowProps> = {
  args: {
    type: 'DEPARTURE',
    locale: 'fi',
    train: TRAIN,
    lastStationId: '',
    stations: [
      {
        stationName: { en: 'Helsinki', sv: 'Helsingfors', fi: 'Helsinki' },
        countryCode: 'FI',
        latitude: 0,
        longitude: 1,
        stationShortCode: 'HKI'
      }
    ],
    stationShortCode: 'HKI',
    cancelledText: translate('en')('cancelled')
  },
  argTypes: {
    animation: {
      table: {
        disable: true
      }
    }
  }
}
export const Cancelled: StoryObj<TimetableRowProps> = {
  ...Default,
  args: { ...Default.args, train: { ...TRAIN, cancelled: true } }
}

export const PreviousStation = {
  ...Default,
  args: {
    ...Default.args,
    lastStationId: `${TRAIN.timeTableRows[0]?.scheduledTime}-${TRAIN.trainNumber}`
  }
}

export default { component: TimetableRow } satisfies Meta<TimetableRowProps>
