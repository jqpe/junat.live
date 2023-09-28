import { Meta, StoryFn } from '@storybook/react'

import { SingleTimetableRow, SingleTimetableRowProps } from './index'
import translate from '~/utils/translate'

export const Default: StoryFn<SingleTimetableRowProps> = args => {
  return <SingleTimetableRow {...args} />
}

export default {
  component: SingleTimetableRow,
  args: {
    timetableRow: {
      scheduledTime: new Date().toISOString(),
      type: 'DEPARTURE',
      cancelled: false,
      stationShortCode: 'HKI'
    },
    stations: [
      {
        stationShortCode: 'HKI',
        stationName: { en: 'Helsinki', fi: 'Helsinki', sv: 'Helsingfors' }
      }
    ],
    locale: 'en',
    cancelledText: translate('en')('cancelled')
  }
} satisfies Meta<SingleTimetableRowProps>
