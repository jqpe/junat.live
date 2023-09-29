import type { Meta, StoryObj } from '@storybook/react'
import type { TimetableRowProps } from '.'

import { TimetableRow, TimetableRowTrain } from '.'
import translate from '~/utils/translate'

const TRAIN: TimetableRowTrain = {
  departureDate: '2022-01-01',
  destination: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
  scheduledTime: new Date().toISOString(),
  trainNumber: 201,
  trainType: 'HDM',
  track: '1'
} as const

export const Default: StoryObj<TimetableRowProps> = {
  args: {
    locale: 'fi',
    train: TRAIN,
    lastStationId: '',
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
    lastStationId: `${TRAIN.scheduledTime}-${TRAIN.trainNumber}`
  }
}

export default { component: TimetableRow } satisfies Meta<TimetableRowProps>
