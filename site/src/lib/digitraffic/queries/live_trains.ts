import { graphql } from '~/generated'

export const trains = graphql(`
  query trains(
    $station: String!
    $includeNonStopping: Boolean = false
    $arrivedTrains: Int = 0
    $arrivingTrains: Int = 0
    $departingTrains: Int = 0
    $departedTrains: Int = 0
    $trainCategories: [String] = ["Commuter", "Long-Distance"]
  ) {
    trainsByStationAndQuantity(
      arrivedTrains: $arrivedTrains
      arrivingTrains: $arrivingTrains
      departedTrains: $departedTrains
      departingTrains: $departingTrains
      includeNonStopping: $includeNonStopping
      station: $station
      trainCategories: $trainCategories
    ) {
      ...SimpleTrain
    }
  }
`)

type Train = {
  timeTableRows: {
    stationShortCode: string
    type: 'DEPARTURE' | 'ARRIVAL'
    liveEstimateTime?: string
    scheduledTime: string
    commercialTrack?: string
    cancelled: boolean
  }[]
  commuterLineID?: string
  trainNumber: number
  version: number
  trainType: string
  departureDate: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeTrains = (trains: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (trains as any[]).map(
    train =>
      ({
        departureDate: train.departureDate,
        trainNumber: train.trainNumber,
        commuterLineID: train.commuterLineid,
        trainType: train.trainType.name,
        timeTableRows: train.timeTableRows
          .filter((tr: { commercialStop: boolean }) => tr.commercialStop)
          .map((tr: { station: { shortCode: string } }) => ({
            ...tr,
            stationShortCode: tr.station.shortCode
          }))
      } as Train)
  )
}
