import type { Meta, StoryFn, StoryObj } from '@storybook/react'

import { SingleTimetableRow, type SingleTimetableRowProps } from './index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
  const props = {
    ...args,
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
    stations: STATIONS
  },
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          {Story()}
        </QueryClientProvider>
      )
    }
  ],
  parameters: {
    nextjs: {
      router: {
        locale: 'en'
      }
    }
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
    }
  }
} satisfies Meta<SingleTimetableRowProps>
