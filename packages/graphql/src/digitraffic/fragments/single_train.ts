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
      ...Row
    }
  }
`)
