import type { ComponentStory, ComponentMeta } from '@storybook/react'
import type {
  SingleTimetableRowStation,
  SingleTimetableRowType
} from '../SingleTimetableRow'

import { SingleTimetable } from './SingleTimetable'

export default {
  title: 'SingleTimetable',
  component: SingleTimetable
} as ComponentMeta<typeof SingleTimetable>

const stations: SingleTimetableRowStation[] = [
  {
    stationName: { en: 'Helsinki', fi: 'Helsinki', sv: 'Helsingfors' },
    stationShortCode: 'HKI'
  },
  {
    stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' },
    stationShortCode: 'AIN'
  }
]

const timetableRows: SingleTimetableRowType[] = [
  {
    scheduledTime: new Date().toString(),
    stationShortCode: 'HKI',
    commercialStop: true,
    type: 'DEPARTURE'
  },
  {
    scheduledTime: new Date().toString(),
    stationShortCode: 'AIN',
    cancelled: true,
    commercialStop: true,
    type: 'ARRIVAL'
  }
]

export const Default: ComponentStory<typeof SingleTimetable> = () => (
  <SingleTimetable
    locale="fi"
    stations={stations}
    timetableRows={timetableRows}
  />
)
