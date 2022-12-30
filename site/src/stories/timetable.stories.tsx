import type { StoryObj } from '@storybook/react'
import type { TimetableProps } from '~/components/timetables/timetable'

import Timetable from '~/components/timetables/timetable'

const TRAIN = {
  departureDate: '2022-01-01',
  destination: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
  scheduledTime: new Date().toISOString(),
  trainNumber: 201,
  trainType: 'HDM',
  track: '1'
} as const

const twoMinutesLate = (() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 2)
  return date.toISOString()
})()

export const Default: StoryObj<TimetableProps> = {
  args: {
    locale: 'fi',
    trains: [
      TRAIN,
      { ...TRAIN, cancelled: true },
      { ...TRAIN, liveEstimateTime: twoMinutesLate, track: '2' }
    ]
  }
}
export default { component: Timetable }
