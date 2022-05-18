import type { ComponentMeta } from '@storybook/react'
import type {
  SingleTimetableRowStation,
  SingleTimetableRowType
} from '../SingleTimetableRow'

import { SingleTimetableRow } from './SingleTimetableRow'

export default {
  component: SingleTimetableRow,
  argTypes: {
    stations: {
      control: false
    },
    timetableRow: {
      control: false
    }
  }
} as ComponentMeta<typeof SingleTimetableRow>

const stations: SingleTimetableRowStation[] = [
  {
    stationName: {
      en: 'Helsinki airport',
      fi: 'Lentoasema',
      sv: 'Helsingfors flygplats'
    },
    stationShortCode: 'LEN'
  }
]

const timetableRow: SingleTimetableRowType = {
  scheduledTime: new Date().toString(),
  stationShortCode: 'LEN',
  commercialStop: true,
  type: 'ARRIVAL'
}

const Template = (args: ComponentMeta<typeof SingleTimetableRow>['args']) => {
  return (
    <SingleTimetableRow
      locale="fi"
      stations={stations}
      timetableRow={timetableRow}
      {...args}
    />
  )
}

export const Default = Template.bind({})
