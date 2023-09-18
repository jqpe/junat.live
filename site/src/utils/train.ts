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

  const destinationStation = stations.find(station => {
    return (
      station.stationShortCode === destinationTimetableRow?.stationShortCode
    )
  })

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
  type TrainKeys = keyof typeof import('../locales/en.json')['trainTypes']

  const tr = translate(locale)
  const t = (train: TrainKeys) => tr('trainTypes', train)

  const codes: Record<Code, string> = {
    AE: 'Allegro',
    IC: 'InterCity',
    PVV: 'Tolstoi',
    S: 'Pendolino',
    MUV: tr('train'),
    HL: t('commuterTrain'),
    HLV: t('commuterTrain'),
    HDM: t('regionalTrain'),
    HSM: t('regionalTrain'),
    HV: t('multipleUnit'),
    MV: t('multipleUnit'),
    V: t('locomotive'),
    VET: t('locomotive'),
    VEV: t('locomotive'),
    LIV: t('trackInspectionTrolley'),
    MUS: t('museumTrain'),
    P: t('expressTrain'),
    PAI: t('onCallTrain'),
    PYO: t('nightExpressTrain'),
    SAA: t('convoyTrain'),
    T: t('cargoTrain'),
    TYO: t('workTrain'),
    VLI: t('additionalLocomotive')
  }

  return codes[code] || tr('train')
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
