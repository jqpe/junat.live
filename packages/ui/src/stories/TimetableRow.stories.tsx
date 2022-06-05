import type { ComponentMeta } from '@storybook/react'

import type {
  TimetableRowTrain,
  TimetableRowTranslations
} from '../components/TimetableRow'

import { TimetableRow } from '../components/TimetableRow'

const date = new Date()
const getLiveEstimate = () => {
  const liveEstimateDate = new Date(date)
  liveEstimateDate.setMinutes(liveEstimateDate.getMinutes() + 1)
  return liveEstimateDate
}

const train: TimetableRowTrain = {
  departureDate: date.toISOString(),
  destination: {
    fi: 'Lentoasema',
    en: 'Helsinki airport',
    sv: 'Helsingfors flygplats'
  },
  scheduledTime: `${date.toISOString()}`,
  trainNumber: 1,
  trainType: 'HDM',
  version: 10321031031,
  commuterLineID: 'R',
  liveEstimateTime: getLiveEstimate().toISOString(),
  track: '1'
}

const translation: Record<'fi' | 'en' | 'sv', TimetableRowTranslations> = {
  fi: {
    train: 'Juna'
  },
  en: {
    train: 'Train'
  },
  sv: {
    train: 'Tåg'
  }
}

const Template = (args: ComponentMeta<typeof TimetableRow>['args']) => {
  const locale = args.locale || 'fi'

  return (
    <TimetableRow
      StationAnchor={({ stationName }) => (
        <a target={'_blank'}>{stationName}</a>
      )}
      TrainAnchor={({ commuterLineId }) => <a>{commuterLineId}</a>}
      lastStationId={`${date.toISOString()}`}
      setLastStationId={id => alert(id)}
      locale={locale}
      train={train}
      translation={translation[locale]}
      {...args}
    />
  )
}

export const Default = Template.bind({})

export default {
  name: 'Timetable/Timetable',
  component: TimetableRow,
  argTypes: {
    locale: {},
    train: {
      defaultValue: train
    },
    translation: {
      table: {
        disable: true
      }
    },
    lastStationId: {
      table: {
        disable: true
      }
    },
    setLastStationId: {
      table: {
        disable: true
      }
    }
  }
} as ComponentMeta<typeof TimetableRow>
