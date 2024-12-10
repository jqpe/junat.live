import { graphql } from '#generated/digitraffic'

export const singleTrainFragment = graphql(`
  fragment SingleTrain on Train {
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
