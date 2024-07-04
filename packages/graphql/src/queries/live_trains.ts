import { graphql } from '#generated'

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
      ...LiveTrain
    }
  }
`)
