import { graphql } from '~/generated/digitraffic'
import { SimpleTrainFragment } from '~/generated/digitraffic/graphql'

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

export const normalizeTrains = (trains: SimpleTrainFragment[]) => {
  return trains.map(train => {
    type NonNullRows = Array<
      NonNullable<NonNullable<(typeof train)['timeTableRows']>[number]>
    >

    const timetableRows = <NonNullRows>(
      train.timeTableRows?.filter(tr => tr !== null)
    )

    return <Train>{
      departureDate: train.departureDate,
      version: Number(train.version),
      trainNumber: train.trainNumber,
      commuterLineID: train.commuterLineid,
      trainType: train.trainType.name,
      timeTableRows: timetableRows.map(tr => ({
        ...tr,
        stationShortCode: tr.station.shortCode
      }))
    }
  })
}
