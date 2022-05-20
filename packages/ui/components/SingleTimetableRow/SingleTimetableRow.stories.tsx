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

const cancelledText: Record<'fi' | 'en' | 'sv', string> = {
  fi: 'Peruttu',
  en: 'Cancelled',
  sv: 'Inställt'
}

const Template = (args: ComponentMeta<typeof SingleTimetableRow>['args']) => {
  const locale = args.locale || 'fi'

  return (
    <SingleTimetableRow
      locale="fi"
      stations={stations}
      cancelledText={cancelledText[locale]}
      timetableRow={timetableRow}
      {...args}
    />
  )
}

export const Default = Template.bind({})
