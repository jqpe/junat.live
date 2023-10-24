import { Meta } from '@storybook/react'
import { SingleTimetable, SingleTimetableProps } from '.'
import translate from '~/utils/translate'
import { Locale } from '~/types/common'

export const Default = {}

const station = (code: string, stationNames: Record<Locale, string>) => {
  return {
    stationName: {
      ...stationNames
    },
    stationShortCode: code
  }
}

const date = (desiredOffsetMins: number) => {
  const minute = 60 * 1000
  return new Date(Date.now() + desiredOffsetMins * minute).toISOString()
}

const STATIONS = [
  station('HKI', {
    en: 'Helsinki airport',
    sv: 'Helsingfors flygplats',
    fi: 'Lentoasema'
  }),
  station('AIN', {
    en: 'Ainola',
    sv: 'Ainola',
    fi: 'Ainola'
  }),
  station('JP', {
    en: 'Järvenpää',
    sv: 'Järvenpää',
    fi: 'Järvenpää'
  })
] as const

const TIMETABLE_ROWS = [
  {
    scheduledTime: new Date().toISOString(),
    stationShortCode: 'HKI',
    type: 'DEPARTURE',
    commercialStop: true
  },
  {
    scheduledTime: date(2),
    stationShortCode: 'JP',
    type: 'DEPARTURE',
    commercialStop: true
  },
  {
    scheduledTime: date(5),
    liveEstimateTime: date(10),
    stationShortCode: 'AIN',
    type: 'ARRIVAL',
    commercialStop: true
  }
] as const

export default {
  component: SingleTimetable,
  args: {
    locale: 'en',
    cancelledText: translate('en')('cancelled'),
    stations: [...STATIONS],
    timetableRows: [...TIMETABLE_ROWS]
  }
} satisfies Meta<SingleTimetableProps>
