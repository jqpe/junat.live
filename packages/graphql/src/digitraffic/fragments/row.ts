import { graphql } from '#generated/digitraffic'

export const row = graphql(`
  fragment Row on TimeTableRow {
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
`)
