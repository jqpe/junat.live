import type { ComponentMeta } from '@storybook/react'

import type { TimetableRowTrain } from '../TimetableRow'

import { Timetable } from '.'
import { TimetableTranslations } from './Timetable'

const date = new Date()
const getLiveEstimate = () => {
  const liveEstimateDate = new Date(date)
  liveEstimateDate.setMinutes(liveEstimateDate.getMinutes() + 1)
  return liveEstimateDate
}

const trains: TimetableRowTrain[] = [
  {
    departureDate: date.toISOString(),
    destination: { fi: 'Helsinki', en: 'Helsinki', sv: 'Helsingfors' },
    scheduledTime: date.toISOString(),
    trainNumber: 1,
    trainType: '',
    version: 10321031031,
    commuterLineID: 'R',
    liveEstimateTime: getLiveEstimate().toISOString(),
    track: '1'
  },
  {
    departureDate: date.toISOString(),
    destination: { fi: 'Riihimäki', en: 'Riihimäki', sv: 'Riihimäki' },
    scheduledTime: date.toISOString(),
    trainNumber: 125,
    trainType: 'HDM',
    version: 10321031031,
    commuterLineID: undefined,
    track: '1'
  }
]

const translation: Record<'fi' | 'en' | 'sv', TimetableTranslations> = {
  fi: {
    train: 'Juna',
    destination: 'Määränpää',
    departureTime: 'Lähtöaika',
    track: 'Raide'
  },
  en: {
    train: 'Train',
    destination: 'Destination',
    departureTime: 'Departure time',
    track: 'Track'
  },
  sv: {
    train: 'Tåg',
    destination: 'Destination',
    departureTime: 'Avgångstid',
    track: 'Spår'
  }
}

const Template = (args: ComponentMeta<typeof Timetable>['args']) => {
  const locale = args.locale || 'fi'

  return (
    <Timetable
      lastStationId={`${date.toISOString()}`}
      setLastStationId={id => alert(id)}
      locale={locale}
      trains={trains}
      translation={translation[locale]}
      {...args}
    />
  )
}

export const Default = Template.bind({})

export default {
  name: 'Timetable/Timetable',
  component: Timetable,
  argTypes: {
    trains: {
      control: false
    },
    translation: {
      control: false
    },
    lastStationId: {
      control: false
    }
  }
} as ComponentMeta<typeof Timetable>
