import { graphql } from '#generated/digitraffic'

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
