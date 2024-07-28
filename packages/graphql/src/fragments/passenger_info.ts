import { graphql } from '#generated'

export const stationPassengerInfoFragment = graphql(`
  fragment StationPassengerInfo on PassengerInformationMessage {
    id
    trainNumber
    startValidity
    endValidity
    trainNumber
    trainDepartureDate
    video {
      text {
        fi
        en
        sv
      }
      deliveryRules {
        deliveryType
        startDateTime
        endDateTime
        endTime
        startTime
        weekDays
      }
    }
  }
`)
