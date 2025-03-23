import type { SingleTrainFragment } from '#generated/digitraffic/graphql.js'

import { graphql } from '#generated/digitraffic'

export const singleTrain = graphql(`
  query singleTrain($departureDate: Date!, $trainNumber: Int!) {
    train(departureDate: $departureDate, trainNumber: $trainNumber) {
      ...SingleTrain
    }
  }
`)

export type NormalizedTrain = {
  commuterLineID?: string
  trainNumber: number
  departureDate: string
  cancelled?: boolean
  trainType: string
  timeTableRows: {
    stationShortCode: string
    commercialStop?: boolean | null
    scheduledTime: string
    type: 'ARRIVAL' | 'DEPARTURE'
    cancelled?: boolean
    liveEstimateTime?: string
    commercialTrack?: string
  }[]
}

export const normalizeSingleTrain = (trains: SingleTrainFragment[]) => {
  const t = trains.at(0)

  if (!t) {
    throw new TypeError('no train')
  }

  if (!t.timeTableRows) {
    throw new TypeError('single train must have timetable rows')
  }

  const timeTableRows = <NonNullable<(typeof t.timeTableRows)[number]>[]>(
    t.timeTableRows.filter(tr => tr !== null)
  )

  return {
    ...t,
    commuterLineID: t.commuterLineid ?? undefined,
    trainType: t.trainType?.name,
    timeTableRows: timeTableRows.map(tr => {
      return {
        ...tr,
        liveEstimateTime: tr.liveEstimateTime ?? undefined,
        commercialTrack: tr.commercialTrack ?? undefined,
        stationShortCode: tr.station.shortCode,
      }
    }),
  }
}
