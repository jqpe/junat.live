import { graphql } from '#generated/digitraffic'

export const liveTrainFragment = graphql(`
  fragment LiveTrain on Train {
    commuterLineid
    version
    trainNumber
    departureDate
    cancelled
    trainType {
      name
    }
    timeTableRows {
      commercialTrack
      commercialStop
      scheduledTime
      type
      commercialTrack
      cancelled
      liveEstimateTime
      station {
        shortCode
        passengerTraffic
      }
    }
  }
`)
