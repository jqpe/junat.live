import Timetable, { TimetableProps } from '@components/Timetable'
import { Meta, Story } from '@storybook/react'

const story: Meta = {
  title: 'Components/Timetable',
  component: Timetable
}

const Template: Story<TimetableProps> = (args: Partial<TimetableProps>) => {
  return <Timetable trains={[]} {...args} />
}

const TRAIN = {
  departureDate: '2022-01-01',
  destination: { fi: 'Helsinki', sv: 'Helsingfors', en: 'Helsinki' },
  scheduledTime: new Date().toISOString(),
  trainNumber: 201,
  trainType: 'HDM',
  track: 1
} as const

const twoMinutesLate = (() => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 2)
  return date.toISOString()
})()

export const Default = Template.bind({})
Default.args = {
  locale: 'fi',
  trains: [
    TRAIN,
    { ...TRAIN, cancelled: true, track: undefined },
    {
      ...TRAIN,
      track: 2,
      liveEstimateTime: twoMinutesLate
    }
  ]
} as Required<TimetableProps>

export default story
