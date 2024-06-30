import type { Meta, StoryFn } from '@storybook/react'
import type { SingleTrainFragment } from '~/generated/graphql'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { graphql, HttpResponse } from 'msw'

import { getCalendarDate } from '@junat/core/utils/date'
import { TimeTableRowType } from '~/generated/graphql'
import Page from '~/layouts/page'
import { TrainPage } from './components/page'

export const Default: StoryFn<typeof TrainPage> = () => {
  return <TrainPage />
}

Default.parameters = {
  msw: {
    handlers: [
      /** See ~/lib/digitraffic/queries/single_train */
      graphql.query('singleTrain', () => {
        return HttpResponse.json({
          data: { train: [TRAIN] },
        })
      }),
    ],
  },
}

// The BlankState is show when a train was fetched and train is still undefined
export const BlankState = Default.bind({})
BlankState.parameters = {
  msw: {
    handlers: [
      /** See ~/lib/digitraffic/queries/single_train */
      graphql.query('singleTrain', () => {
        return HttpResponse.json({
          data: {},
        })
      }),
    ],
  },
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
      station: { shortCode: 'JP', passengerTraffic: true },
      scheduledTime: newDate(0, 2).toISOString(),
    },
  ],
}

export default {
  component: TrainPage,
  decorators: [
    Story => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Page>{Story()}</Page>
        </QueryClientProvider>
      )
    },
  ],
  parameters: {
    nextjs: {
      router: {
        locale: 'en',
        asPath: `/train/${TRAIN.trainNumber}`,
        query: {
          trainNumber: String(TRAIN.trainNumber),
          date: TRAIN.departureDate,
        },
      },
    },
  },
} satisfies Meta<typeof TrainPage>
