import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import type { RowFragment } from '@junat/graphql/digitraffic'
import type { SingleTimetableRowProps } from './index'
import type { Locale } from '~/types/common'

import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { SingleTimetableRow } from './index'

const TIMETABLE_ROW = {
  scheduledTime: new Date().toISOString(),
  type: TimeTableRowType.Departure,
  cancelled: false,
  station: { shortCode: 'HKI' },
  commercialTrack: null,
  commercialStop: true,
  liveEstimateTime: null,
  actualTime: null,
} satisfies RowFragment

const STATIONS = [
  {
    stationShortCode: 'HKI',
    stationName: {
      en: 'Helsinki airport',
      fi: 'Lentoasema',
    } as Record<Locale, string>,
  },
]

export const Default: StoryObj<SingleTimetableRowProps> = {}

export const Cancelled: StoryFn<SingleTimetableRowProps> = args => {
  const props = {
    ...args,
    timetableRow: { ...TIMETABLE_ROW, cancelled: true },
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
      })(),
    },
  },
}

export default {
  component: SingleTimetableRow,
  args: {
    timetableRow: TIMETABLE_ROW,
    stations: STATIONS,
  },
  parameters: {
    nextjs: {
      router: {
        locale: 'en',
      },
    },
  },
  argTypes: {
    stations: {
      table: {
        disable: true,
      },
    },
    timetableRow: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<SingleTimetableRowProps>
