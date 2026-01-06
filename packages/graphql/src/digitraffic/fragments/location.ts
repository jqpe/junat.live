import { graphql } from '#generated/digitraffic'

export const locationFragment = graphql(`
  fragment TrainLocation on TrainLocation {
    speed
    accuracy
    timestamp
    location
    train {
      trainNumber
      trainType {
        name
      }
      operator {
        uicCode
      }
      commuterLineId: commuterLineid
      compositions {
        journeySections {
          startTimeTableRow {
            station {
              shortCode
            }
          }
          endTimeTableRow {
            station {
              shortCode
            }
          }
        }
      }
    }
  }
`)
