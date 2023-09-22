import { graphql } from '~/generated'

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
    commercialStop?: boolean
    scheduledTime: string
    type: 'ARRIVAL' | 'DEPARTURE'
    cancelled?: boolean
    liveEstimateTime?: string
  }[]
}

export const normalizeSingleTrain = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  train: any
): Train => {
  const t = train[0]

  return {
    trainNumber: t.trainNumber,
    departureDate: t.departureDate,
    cancelled: 'cancelled' in t ? t.cancelled : undefined,
    trainType: t.trainType?.name,
    timeTableRows: t.timeTableRows.map(
      (tr: { station: { shortCode: string } }) => ({
        ...tr,
        stationShortCode: tr.station.shortCode
      })
    )
  }
}
