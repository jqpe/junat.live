import { graphql } from '~/generated'
import { SimpleTrainFragment } from '~/generated/graphql'

export const singleTrain = graphql(`
  query singleTrain($departureDate: Date!, $trainNumber: Int!) {
    train(departureDate: $departureDate, trainNumber: $trainNumber) {
      ...SimpleTrain
    }
  }
`)

export type Train = {
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
  }[]
}

export const normalizeSingleTrain = (trains: SimpleTrainFragment[]): Train => {
  const t = trains[0]

  if (!t.timeTableRows) {
    throw new TypeError('single train must have timetable rows')
  }

  const timeTableRows = <NonNullable<(typeof t.timeTableRows)[number]>[]>(
    t.timeTableRows.filter(tr => tr !== null)
  )

  return {
    trainNumber: t.trainNumber,
    departureDate: t.departureDate,
    cancelled: 'cancelled' in t ? t.cancelled : undefined,
    trainType: t.trainType?.name,
    timeTableRows: timeTableRows.map(tr => {
      if (tr.liveEstimateTime === null) {
        tr.liveEstimateTime = undefined
      }

      return {
        ...tr,
        stationShortCode: tr.station.shortCode,
        liveEstimateTime: tr.liveEstimateTime
      }
    })
  }
}
