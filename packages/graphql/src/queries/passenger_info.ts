import { graphql } from '#generated'

export const stationPassengerInfo = graphql(`
  query stationPassengerInfo(
    $stationShortCode: String!
    $onlyGeneral: Boolean = true
  ) {
    passengerInformationMessagesByStation(
      stationShortCode: $stationShortCode
      onlyGeneral: $onlyGeneral
    ) {
      ...StationPassengerInfo
    }
  }
`)
