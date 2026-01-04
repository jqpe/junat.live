import { graphql } from '#generated/digitraffic'

export const locationFragment = graphql(`
  fragment TrainLocation on TrainLocation {
    speed
    accuracy
    timestamp
    location
    train {
      trainNumber
      commuterLineid
    }
  }
`)
