import { Meta, StoryObj, StoryFn } from '@storybook/react'

import { SingleTimetableRow, SingleTimetableRowProps } from './index'
import translate from '~/utils/translate'

const TIMETABLE_ROW = {
  scheduledTime: new Date().toISOString(),
  type: 'DEPARTURE',
  cancelled: false,
  stationShortCode: 'HKI'
} as const

const STATIONS = [
  {
    stationShortCode: 'HKI',
    stationName: {
      en: 'Helsinki airport',
      fi: 'Lentoasema',
      sv: 'Helsingfors flygplats'
    }
  }
]

export const Default: StoryObj<SingleTimetableRowProps> = {}

export const Cancelled: StoryFn<SingleTimetableRowProps> = args => {
  const cancelledText = translate(args.locale)('cancelled')
  const props = {
    ...args,
    cancelledText,
    timetableRow: { ...TIMETABLE_ROW, cancelled: true }
  }

  return <SingleTimetableRow {...props} />
}

export const LiveEstimate: StoryObj<SingleTimetableRowProps> = {
  args: {
    timetableRow: {
      ...TIMETABLE_ROW,
      liveEstimateTime: (() => {
        const twoMinutes = 2 * 60 * 1000
        const date = Date.now() + twoMinutes

        return new Date(date).toISOString()
      })()
    }
  }
}

export default {
  component: SingleTimetableRow,
  args: {
    timetableRow: TIMETABLE_ROW,
    stations: STATIONS,
    locale: 'en'
  },
  argTypes: {
    stations: {
      table: {
        disable: true
      }
    },
    timetableRow: {
      table: {
        disable: true
      }
    },
    cancelledText: {
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<SingleTimetableRowProps>
