import type { SimplifiedTrain } from '@typings/simplified_train'
import type { Locale } from '@typings/common'

// Not polyfilled by Next.js
// See https://caniuse.com/mdn-javascript_builtins_array_at
import 'core-js/actual/array/at'

import { getDestinationTimetableRow } from '@utils/get_destination_timetable_row'

import translate from './translate'

export interface ITrain extends Partial<SimplifiedTrain> {
  scheduledTime: string
}

export type Codes = [
  'AE',
  'HDM',
  'HL',
  'HLV',
  'HSM',
  'HV',
  'IC',
  'LIV',
  'MUS',
  'MUV',
  'MV',
  'P',
  'PAI',
  'PVV',
  'PYO',
  'S',
  'SAA',
  'T',
  'TYO',
  'VET',
  'VEV',
  'VLI',
  'V'
]

export type Code = Codes[number]

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

export const sortSimplifiedTrains = <T extends ITrain>(
  trains: Readonly<T[]>
) => {
  return [...trains].sort((aTrain, bTrain) => {
    return Date.parse(aTrain.scheduledTime) - Date.parse(bTrain.scheduledTime)
  })
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

  const timetableRow = getFutureTimetableRow(
    stationShortCode,
    train.timeTableRows
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

export const getTrainType = (code: Code, locale: Locale): string => {
  const t = translate(locale)

  if (['HL', 'HLV'].includes(code)) {
    return t('trainTypes', 'commuterTrain')
  }

  if (['HDM', 'HSM'].includes(code)) {
    return t('trainTypes', 'regionalTrain')
  }

  if (['HV', 'MV'].includes(code)) {
    return t('trainTypes', 'multipleUnit')
  }

  if (['V', 'VET', 'VEV'].includes(code)) {
    return t('trainTypes', 'locomotive')
  }

  switch (code) {
    case 'AE':
      return 'Allegro'

    case 'IC':
      return 'InterCity'

    case 'LIV':
      return t('trainTypes', 'trackInspectionTrolley')

    case 'MUS':
      return t('trainTypes', 'museumTrain')

    case 'P':
      return t('trainTypes', 'expressTrain')

    case 'PAI':
      return t('trainTypes', 'onCallTrain')

    case 'PVV':
      return 'Tolstoi'

    case 'PYO':
      return t('trainTypes', 'nightExpressTrain')

    case 'S':
      return 'Pendolino'

    case 'SAA':
      return t('trainTypes', 'convoyTrain')

    case 'T':
      return t('trainTypes', 'cargoTrain')

    case 'TYO':
      return t('trainTypes', 'workTrain')

    case 'VLI':
      return t('trainTypes', 'additionalLocomotive')

    default:
      return t('train')
  }
}

/**
 * Some trains might depart multiple times from a station. This function gets the timetable row that is closest to departing.
 */
export const getFutureTimetableRow = <
  T extends { stationShortCode: string; scheduledTime: string; type: string }
>(
  stationShortCode: string,
  timetableRows: T[],
  type: 'DEPARTURE' | 'ARRIVAL' = 'DEPARTURE'
): T | undefined => {
  const stationTimetableRows = timetableRows.filter(
    tr => tr.stationShortCode === stationShortCode && tr.type === type
  )

  if (stationTimetableRows.length === 0) {
    return
  }

  return (
    stationTimetableRows.find(({ scheduledTime }) => {
      return +new Date(scheduledTime) - Date.now() > 0
    }) || stationTimetableRows[stationTimetableRows.length - 1]
  )
}
