import type { SingleTrainFragment } from '~/generated/graphql'

import { graphql } from '~/generated'

export const singleTrain = graphql(`
  query singleTrain($departureDate: Date!, $trainNumber: Int!) {
    train(departureDate: $departureDate, trainNumber: $trainNumber) {
      ...SingleTrain
    }
  }
`)

export type Train = {
  commuterLineID?: string | undefined
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

export const normalizeSingleTrain = (trains: SingleTrainFragment[]): Train => {
  const t = trains[0]

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
      if (tr.liveEstimateTime === null) {
        tr.liveEstimateTime = undefined
      }

      return {
        ...tr,
        commercialTrack: tr.commercialTrack ?? undefined,
        stationShortCode: tr.station.shortCode,
        liveEstimateTime: tr.liveEstimateTime
      }
    })
  }
}
