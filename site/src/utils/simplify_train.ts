import type { SimplifiedTrain } from '@typings/simplified_train'

import type { Locale } from '@typings/common'

import { getDestinationTimetableRow } from '@utils/get_destination_timetable_row'

interface Train {
  timeTableRows: {
    stationShortCode: string
    type: 'DEPARTURE' | 'ARRIVAL'
    liveEstimateTime?: string
    scheduledTime: string
    commercialTrack?: string
    cancelled: boolean
  }[]
  commuterLineID?: string
  trainNumber: number
  version: number
  trainType: string
  departureDate: string
}

export const simplifyTrains = <
  T extends Parameters<typeof simplifyTrain>[2][number]
>(
  trains: Train[],
  stationShortCode: string,
  stations: T[]
) => {
  return trains.map(train => simplifyTrain(train, stationShortCode, stations))
}

/**
 * Returns a train with only necessary values used in the application.
 *
 * Used with digitraffic trains endpoint to reduce data allocated; this reduces memory usage significantly.
 */
export const simplifyTrain = <
  T extends { stationShortCode: string; stationName: Record<Locale, string> }
>(
  train: Train,
  stationShortCode: string,
  stations: T[]
): SimplifiedTrain => {
  const destinationTimetableRow = getDestinationTimetableRow(
    train,
    stations.find(station => station.stationShortCode === stationShortCode)
      ?.stationShortCode
  )

  const timetableRow = train.timeTableRows.find(
    tr => tr.stationShortCode === stationShortCode && tr.type === 'DEPARTURE'
  )

  const destinationStation = stations.find(
    station =>
      station.stationShortCode === destinationTimetableRow?.stationShortCode
  )

  if (!destinationStation) {
    throw new Error(
      `Station could not be found for ${destinationTimetableRow?.stationShortCode}`
    )
  }

  if (!timetableRow) {
    throw new Error(`Couldn't find timetable row for ${stationShortCode}.`)
  }

  return {
    destination: destinationStation.stationName,
    scheduledTime: timetableRow.scheduledTime,
    liveEstimateTime: timetableRow.liveEstimateTime,
    trainNumber: train.trainNumber,
    trainType: train.trainType,
    version: train.version,
    commuterLineID: train.commuterLineID,
    track: timetableRow.commercialTrack,
    departureDate: train.departureDate,
    cancelled: timetableRow.cancelled
  }
}
