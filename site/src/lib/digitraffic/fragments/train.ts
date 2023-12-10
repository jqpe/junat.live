import { graphql } from '~/generated/digitraffic'

export const trainFragment = graphql(`
  fragment SimpleTrain on Train {
    commuterLineid
    version
    trainNumber
    departureDate
    cancelled
    trainType {
      name
    }
    timeTableRows {
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

    operator {
      uicCode
      shortCode
    }

    # Get the most recent location for a single train, use MQTT to track live
    trainLocations(orderBy: { timestamp: DESCENDING }, take: 1) {
      timestamp
      location
    }
  }
`)
