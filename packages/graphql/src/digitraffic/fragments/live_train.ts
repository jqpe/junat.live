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

    compositions {
      journeySections {
        startTimeTableRow {
          station {
            shortCode
            location
          }
        }
        endTimeTableRow {
          station {
            shortCode
            location
          }
        }
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
