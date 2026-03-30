import { graphql } from '#generated/digitraffic'

export const locationFragment = graphql(`
  fragment TrainLocation on TrainLocation {
    speed
    accuracy
    timestamp
    location
    train {
      trainNumber
      departureDate
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
      firstRow: timeTableRows(take: 1) {
        station {
          shortCode
        }
      }
      lastRow: timeTableRows(
        take: 1
        orderBy: [{ scheduledTime: DESCENDING }]
      ) {
        station {
          shortCode
        }
      }
    }
  }
`)
