import type { ComponentMeta } from '@storybook/react'
import type {
  SingleTimetableRowStation,
  SingleTimetableRowType
} from '../SingleTimetableRow'

import { SingleTimetable } from './SingleTimetable'

export default {
  component: SingleTimetable,
  argTypes: {
    stations: {
      control: false
    },
    timetableRows: {
      control: false
    }
  }
} as ComponentMeta<typeof SingleTimetable>

const stations: SingleTimetableRowStation[] = [
  {
    stationName: { en: 'Helsinki', fi: 'Helsinki', sv: 'Helsingfors' },
    stationShortCode: 'HKI'
  },
  {
    stationName: {
      en: 'Helsinki airport',
      fi: 'Lentoasema',
      sv: 'Helsingfors flygplats'
    },
    stationShortCode: 'LEN'
  },
  {
    stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' },
    stationShortCode: 'AIN'
  }
]

const defaultDate = new Date()

const timetableRows: SingleTimetableRowType[] = [
  {
    scheduledTime: defaultDate.toISOString(),
    stationShortCode: 'HKI',
    commercialStop: true,
    type: 'ARRIVAL'
  },
  {
    scheduledTime: defaultDate.toString(),
    stationShortCode: 'HKI',
    commercialStop: true,
    type: 'DEPARTURE'
  },
  {
    scheduledTime: defaultDate.toISOString(),
    stationShortCode: 'LEN',
    commercialStop: true,
    type: 'DEPARTURE'
  },
  {
    scheduledTime: defaultDate.toString(),
    stationShortCode: 'AIN',
    cancelled: true,
    liveEstimateTime: '01 Jan 1970 00:00:00 ',
    commercialStop: true,
    type: 'ARRIVAL'
  }
]

const Template = (args: ComponentMeta<typeof SingleTimetable>['args']) => {
  return (
    <SingleTimetable
      locale="fi"
      stations={stations}
      timetableRows={timetableRows}
      {...args}
    />
  )
}

export const Default = Template.bind({})
