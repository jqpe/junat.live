import type { Meta, StoryFn } from '@storybook/react'
import type { SingleTrainFragment } from '@junat/graphql/digitraffic'
import type { Locale } from '~/types/common'

import { useRouter } from 'next/router'
import { graphql, HttpResponse } from 'msw'

import { getCalendarDate } from '@junat/core/utils/date'
import { TimeTableRowType } from '@junat/graphql/digitraffic'

import { withI18n, withPageLayout } from '~/../.storybook/utils'
import { Station as StationPage } from './components/page'

export const Default: StoryFn<typeof StationPage> = () => {
  const router = useRouter()

  return (
    <StationPage
      locale={router.locale as Locale}
      station={{
        stationName: { en: 'Ainola', fi: 'Ainola', sv: 'Ainola' },
        countryCode: 'FI',
        latitude: 32,
        longitude: 12,
        stationShortCode: 'AIN',
      }}
    />
  )
}

const today = new Date()
const newDate = (hours: number, minutes: number) => {
  return new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      today.getUTCHours() + hours,
      today.getUTCMinutes() + minutes,
    ),
  )
}

const ROW: NonNullable<SingleTrainFragment['timeTableRows']>[number] = {
  commercialStop: true,
  scheduledTime: today.toISOString(),
  type: TimeTableRowType.Departure,
  commercialTrack: '5',
  cancelled: false,
  liveEstimateTime: null,
  station: {
    shortCode: 'HKI',
    passengerTraffic: true,
  },
}

const TRAIN: SingleTrainFragment = {
  cancelled: false,
  departureDate: getCalendarDate(today.toISOString()),
  trainNumber: 1,
  trainType: { name: 'HL' },
  version: '288282907688',
  commuterLineid: 'R',
  timeTableRows: [
    ROW,
    {
      ...ROW,
      station: { shortCode: 'AIN', passengerTraffic: true },
      scheduledTime: newDate(0, 2).toISOString(),
    },
  ],
}

export default {
  component: StationPage,
  decorators: [withPageLayout(), withI18n()],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: { locale: 'en' },
    },
    msw: {
      handlers: [
        graphql.query('trains', () => {
          return HttpResponse.json({
            data: {
              trainsByStationAndQuantity: [TRAIN],
            },
          })
        }),
      ],
    },
  },
} satisfies Meta<typeof StationPage>
